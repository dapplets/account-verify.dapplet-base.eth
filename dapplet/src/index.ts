import abi from './abi';
import { } from '@dapplets/dapplet-extension';
import ICON_DAPPLET from './icons/dapplet.png';
import ICON_GREEN from './icons/green.svg';
import ICON_ORANGE from './icons/orange.png';
import ICON_RED from './icons/red.png';
import ICON_LOADING from './icons/loading.svg';

type Msg = {
    uuid: string;
    text: string;
};

type Account = {
    domainId: number; // 1 - twitter, 2 - ens
    name: string;
    status: any;
}

@Injectable
export default class Feature {
    private _currentAddress: string = null;
    private _contract: any;
    private _accounts = new Map<string, Promise<Account[]>>();
    private _overlay;
    private _activeMessageIds = [];
    private _onPostStartedHandler: (ctx: any) => void = null;
    private _wallet: any;

    constructor(
        @Inject("identity-adapter.dapplet-base.eth")
        public identityAdapter: any, // ITwitterAdapter;

        @Inject("common-adapter.dapplet-base.eth")
        public viewportAdapter: any
    ) {
        this._configure();
    }

    private _configure() {
        const { statusLine } = this.viewportAdapter.exports;
        const { avatarBadge, button } = this.identityAdapter.exports;

        const badgeConfig = ({
            initial: "DEFAULT",
            "DEFAULT": {
                img: ICON_LOADING,
                vertical: "bottom",
                horizontal: "left",
                init: async (ctx, me) => {
                    const accounts = await this._getAccounts({ domainId: 1, name: ctx.authorUsername });
                    if (accounts.length === 0) me.setState("HIDDEN");
                    else if (accounts[0].status === 0) me.setState("NO_ISSUES");
                    else if (accounts[0].status === 1) me.setState("EXCEPTION");
                    else if (accounts[0].status === 2) me.setState("SCAMMER");
                    // ToDo: add message in StatusBar
                }
            },
            "NO_ISSUES": {
                img: ICON_GREEN,
                vertical: "bottom",
                horizontal: "left"
            },
            "EXCEPTION": {
                img: ICON_ORANGE,
                vertical: "bottom",
                horizontal: "left"
            },
            "SCAMMER": {
                img: ICON_RED,
                vertical: "bottom",
                horizontal: "left"
            },
            "HIDDEN": {
                hidden: true
            }
        });

        this.identityAdapter.attachConfig({
            events: {
                profile_changed: async (after, before) => {
                    if (!before || !after || after.authorUsername !== before.authorUsername) {
                        statusLine.removeMessage(this._activeMessageIds);
                        if (!after) return;
                        const messages: Msg[] = await this._getMessages({ domainId: 1, name: after.authorUsername });
                        messages.forEach(m => {
                            statusLine.addMessage({
                                uuid: m.uuid,
                                text: m.text
                            });
                            this._activeMessageIds.push(m.uuid);
                        });
                    }
                }
            },
            PROFILE: () => [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: ICON_DAPPLET,
                        label: '',
                        exec: async (ctx) => {
                            /*
                                ToDo:
                                Here is a new overlay is creating everytime, when the button is clicked, because
                                it's not clear how to unsubscribe from events below.
                            */
                            const url = await Core.storage.get('overlayUrl');
                            const overlay = Core.overlay({ url, title: 'Identity Management' });

                            const contractAddress = await Core.storage.get('contractAddress');
                            const oracleAddress = await Core.storage.get('oracleAddress');
                            const wallet = await this._getWallet();

                            overlay.sendAndListen('profile_select', { ...ctx, contractAddress, oracleAddress }, {
                                'sign_prove': (op, { type, message }) => {
                                    wallet.sendAndListen('eth_accounts', [], {
                                        result: (op, { type, data }) => {
                                            this._currentAddress = data[0];
                                            wallet.sendAndListen('personal_sign', [message, this._currentAddress], {
                                                result: (op, { type, data }) => overlay.send('prove_signed', data)
                                            });
                                        }
                                    });
                                },
                                'get_account': () => {
                                    wallet.sendAndListen('eth_accounts', [], {
                                        result: (op, { type, data }) => {
                                            this._currentAddress = data[0];
                                            overlay.send('current_account', this._currentAddress);
                                        }
                                    });
                                },
                                'wait_prove': (op, { type, message }) => {
                                    this._onPostStartedHandler = (ctx) => {
                                        if (ctx.authorUsername === message.username && ctx.text.indexOf(message.prove) !== -1) {
                                            this._onPostStartedHandler = null;
                                            overlay.send('prove_published', ctx);
                                        }
                                    }
                                },
                                'addAccount': (_, { message }) => this._contract.addAccount(...message).then(tx => tx.wait()).then(() => overlay.send('addAccount_done')),
                                'removeAccount': (_, { message }) => this._contract.removeAccount(...message).then(tx => tx.wait()).then(() => overlay.send('removeAccount_done')),
                                'createClaim': (_, { message }) => this._contract.createClaim(...message).then(tx => tx.wait()).then(() => overlay.send('createClaim_done')),
                                'cancelClaim': (_, { message }) => this._contract.cancelClaim(...message).then(tx => tx.wait()).then(() => overlay.send('cancelClaim_done')),
                                'approveClaim': (_, { message }) => this._contract.approveClaim(...message).then(tx => tx.wait()).then(() => overlay.send('approveClaim_done')),
                                'rejectClaim': (_, { message }) => this._contract.rejectClaim(...message).then(tx => tx.wait()).then(() => overlay.send('rejectClaim_done')),
                            });
                        }
                    }
                }),
                avatarBadge(badgeConfig)
            ],
            POST: () => [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx) => this._onPostStartedHandler?.(ctx)
                    }
                }),
                avatarBadge(badgeConfig)
            ]
        });
    }

    private async _getAccounts(account: { domainId: number, name: string }): Promise<Account[]> {
        if (!account.name) return [];
        account.name = account.name.toLowerCase();

        if (!this._contract) {
            const contractAddress = await Core.storage.get('contractAddress');
            this._contract = Core.contract('ethereum', contractAddress, abi);
        }

        const key = `${account.domainId}/${account.name}`;

        if (!this._accounts.has(key)) {
            this._accounts.set(key, this._contract.getAccounts(account));
        }

        return this._accounts.get(key);
    }

    private async _getMessages(account: { domainId: number, name: string }): Promise<Msg[]> {
        const accounts = await this._getAccounts(account);
        const key = `${account.domainId}/${account.name}`;
        if (accounts.length === 0) {
            return [];
        } else if (accounts[0].status == 0) {
            return [];
        } else if (accounts[0].status == 1) {
            return [{ uuid: key, text: 'Unusual behaviour' }];
        } else if (accounts[0].status == 2) {
            return [{ uuid: key, text: 'Account mimics another one or produces too many scams' }];
        }
        return [];
    }

    private async _getWallet() {
        const wallet = await Core.wallet({ type: 'ethereum', network: 'rinkeby' });
        console.log(wallet);
        if (!await wallet.isConnected()) await wallet.connect();
        return wallet;
    }
}