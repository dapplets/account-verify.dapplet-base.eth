import abi from './abi';
import {} from '@dapplets/dapplet-extension';
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
    private _currentProve: string = null;
    private _currentAddress: string = null;
    private _contract: any;
    private _accounts = new Map<string, Promise<Account[]>>();
    private _overlay;
    private _activeMessageIds = [];

    constructor(
        @Inject("identity-adapter.dapplet-base.eth")
        public identityAdapter: any, // ITwitterAdapter;

        @Inject("common-adapter.dapplet-base.eth")
        public viewportAdapter: any
    ) {
        const wallet = Core.wallet();
        Core.storage.get('overlayUrl').then(url => this._overlay = Core.overlay({ url, title: 'Identity Management' }));

        const { statusLine } = viewportAdapter.exports;
        const { badge, button } = this.identityAdapter.exports;

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
            PROFILE_BUTTON_GROUP: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: ICON_DAPPLET,
                        label: '',
                        exec: async (ctx) => {

                            const contractAddress = await Core.storage.get('contractAddress');
                            const oracleAddress = await Core.storage.get('oracleAddress');

                            this._overlay.sendAndListen('profile_select', { ...ctx, contractAddress, oracleAddress }, {
                                'sign_prove': (op, { type, message }) => {
                                    wallet.sendAndListen('eth_accounts', [], {
                                        result: (op, { type, data }) => {
                                            this._currentAddress = data[0];
                                            wallet.sendAndListen('personal_sign', [message, this._currentAddress], {
                                                result: (op, { type, data }) => {
                                                    this._currentProve = data;
                                                    this._overlay.send('prove_signed', this._currentProve);
                                                }
                                            });
                                        }
                                    });
                                },
                                'get_account': () => {
                                    wallet.sendAndListen('eth_accounts', [], {
                                        result: (op, { type, data }) => {
                                            this._currentAddress = data[0];
                                            this._overlay.send('current_account', this._currentAddress);
                                        }
                                    });
                                },
                                // 'send_transaction': (op, { type, message }) => {
                                //     wallet.sendAndListen('eth_sendTransaction', [message], {
                                //         result: (op, { type, data }) => {
                                //             this._overlay.send('transaction_result', data);
                                //         }
                                //     });
                                // },
                                'addAccount': (_, { message }) => this._contract.addAccount(...message).then(tx => tx.wait()).then(() => this._overlay.send('addAccount_done')),
                                'removeAccount': (_, { message }) => this._contract.removeAccount(...message).then(tx => tx.wait()).then(() => this._overlay.send('removeAccount_done')),
                                'createClaim': (_, { message }) => this._contract.createClaim(...message).then(tx => tx.wait()).then(() => this._overlay.send('createClaim_done')),
                                'cancelClaim': (_, { message }) => this._contract.cancelClaim(...message).then(tx => tx.wait()).then(() => this._overlay.send('cancelClaim_done')),
                                'approveClaim': (_, { message }) => this._contract.approveClaim(...message).then(tx => tx.wait()).then(() => this._overlay.send('approveClaim_done')),
                                'rejectClaim': (_, { message }) => this._contract.rejectClaim(...message).then(tx => tx.wait()).then(() => this._overlay.send('rejectClaim_done')),
                            });
                        }
                    }
                })
            ],
            POST_SOUTH: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx) => {
                            if (this._currentProve !== null && this._currentProve === ctx.text) {
                                this._overlay.send('prove_published', `https://twitter.com/${ctx.authorUsername}/status/${ctx.id}`);
                            }
                        }
                    }
                })
            ],
            POST_AVATAR_BADGE: [
                badge(badgeConfig)
            ],
            PROFILE_AVATAR_BADGE: [
                badge(badgeConfig)
            ]
        });
    }

    private async _getAccounts(account: { domainId: number, name: string }): Promise<Account[]> {
        if (!account.name) return [];
        account.name = account.name.toLowerCase();
        
        if (!this._contract) {
            const contractAddress = await Core.storage.get('contractAddress');
            this._contract = Core.contract(contractAddress, abi);
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
}