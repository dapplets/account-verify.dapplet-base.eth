import abi from './abi';
import ethers from 'ethers';
import { IFeature } from '@dapplets/dapplet-extension';
import ICON_DAPPLET from './icons/dapplet.png';
import ICON_GREEN from './icons/green.svg';
import ICON_LOADING from './icons/loading.svg';
import DefaultConfig from './config/default.json';
import SchemaConfig from './config/schema.json';

type Account = {
    domainId: number; // 1 - twitter, 2 - ens
    name: string;
}

@Injectable
@Configure(DefaultConfig, SchemaConfig)
export default class Feature {
    public config: any; // T_TwitterFeatureConfig;
    private _currentProve: string = null;
    private _currentAddress: string = null;
    private _contract: ethers.Contract;
    private _accounts = new Map<string, Promise<Account[]>>();
    private _overlay;

    constructor(
        @Inject("identity-adapter.dapplet-base.eth")
        public adapter: any // ITwitterAdapter;
    ) {
        const wallet = Core.wallet();
        Core.storage.get('overlayUrl').then(url => this._overlay = Core.overlay({ url, title: 'Identity Management' }));

        const { badge, button } = this.adapter.widgets;

        this.config = {
            PROFILE_BUTTON_GROUP: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: ICON_DAPPLET,
                        label: '',
                        exec: (ctx) => {
                            console.log(ctx);
                            wallet.sendAndListen('eth_accounts', [], {
                                result: (op, { type, data }) => {
                                    this._currentAddress = data[0];
                                }
                            });

                            this._overlay.sendAndListen('profile_select', ctx, {
                                'sign_prove': (op, { type, message }) => {
                                    wallet.sendAndListen('personal_sign', [message, this._currentAddress], {
                                        result: (op, { type, data }) => {
                                            this._currentProve = data;
                                            this._overlay.send('prove_signed', this._currentProve);
                                        }
                                    });
                                },
                                'get_account': () => this._overlay.send('current_account', this._currentAddress),
                                'send_transaction': (op, { type, message }) => {
                                    wallet.sendAndListen('eth_sendTransaction', [message], {
                                        result: (op, { type, data }) => {
                                            this._overlay.send('transaction_result', data);
                                        }
                                    });
                                }
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
                badge({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: ICON_LOADING,
                        vertical: "bottom",
                        horizontal: "left",
                        init: async (ctx, me) => {
                            const accounts = await this._getAccounts({ domainId: 1, name: ctx.authorUsername.toLowerCase() });
                            me.setState((accounts.length > 0) ? "GREEN" : "HIDDEN");
                        }
                    },
                    "GREEN": {
                        img: ICON_GREEN,
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    "HIDDEN": {
                        hidden: true
                    }
                })
            ],
            PROFILE_AVATAR_BADGE: [
                badge({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: ICON_LOADING,
                        vertical: "bottom",
                        horizontal: "left",
                        init: async (ctx, me) => {
                            const accounts = await this._getAccounts({ domainId: 1, name: ctx.authorUsername.toLowerCase() });
                            me.setState((accounts.length > 0) ? "GREEN" : "HIDDEN");
                        }
                    },
                    "GREEN": {
                        img: ICON_GREEN,
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    "HIDDEN": {
                        hidden: true
                    }
                })
            ]
        };

        this.adapter.attachConfig(this.config);
    }

    private async _getAccounts(account: Account): Promise<Account[]> {
        if (!this._contract) {
            const contractAddress = await Core.storage.get('contractAddress');
            const provider = ethers.getDefaultProvider('rinkeby');
            this._contract = new ethers.Contract(contractAddress, abi, provider);
        }        

        const key = `${account.domainId}/${account.name}`;

        if (!this._accounts.has(key)) {
            this._accounts.set(key, this._contract.getAccounts(account));
        }

        return this._accounts.get(key);
    }
}