import { IFeature } from '@dapplets/dapplet-extension'

import ICON_DAPPLET from './icons/dapplet.png';
import ICON_GREEN from './icons/green.svg';
import ICON_YELLOW from './icons/yellow.svg';
import ICON_RED from './icons/red.svg';
import ICON_LOADING from './icons/loading.svg';

import abi from './abi';
import ethers from 'ethers';

type Account = {
    domainId: number; // 1 - twitter, 2 - ens
    name: string;
}

@Injectable
export default class Feature implements IFeature {

    @Inject("twitter-adapter.dapplet-base.eth")
    public adapter: any; // ITwitterAdapter;
    @Inject("common-adapter.dapplet-base.eth")
    public adapter2: any; // ITwitterAdapter;
    public config: any; // T_TwitterFeatureConfig;

    private _currentProve: string = null;
    private _currentAddress: string = null;

    private _contract: ethers.Contract;

    private _accounts = new Map<string, Promise<Account[]>>();

    constructor() {
        const wallet = Core.wallet();
        const overlay = Core.overlay({ url: 'https://localhost:3000', title: 'Identity Management' });
        const { badge, button } = this.adapter.widgets;
        const { popup } = this.adapter2.widgets;

        const provider = ethers.getDefaultProvider('rinkeby');
        this._contract = new ethers.Contract('0x3ecb70ec3e63f2c0e11324ae9f1332aa062a85cc', abi, provider);

        console.log('contract', this._contract);

        this.config = {
            PROFILE_BUTTON_GROUP: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: ICON_DAPPLET,
                        label: '',
                        exec: (ctx) => {
                            wallet.sendAndListen('eth_accounts', [], {
                                result: (op, { type, data }) => {
                                    this._currentAddress = data[0];
                                }
                            });

                            overlay.sendAndListen('profile_select', ctx, {
                                'sign_prove': (op, { type, message }) => {
                                    wallet.sendAndListen('personal_sign', [message, this._currentAddress], {
                                        result: (op, { type, data }) => {
                                            this._currentProve = data;
                                            overlay.send('prove_signed', this._currentProve);
                                        }
                                    });
                                },
                                'get_account': () => overlay.send('current_account', this._currentAddress)
                            });
                        }
                    }
                })
            ],
            TWEET_SOUTH: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx) => {
                            if (this._currentProve !== null && this._currentProve === ctx.text) {
                                overlay.send('prove_published', `https://twitter.com/${ctx.authorUsername}/status/${ctx.id}`);
                            }
                        }
                    }
                })
            ],
            TWEET_AVATAR_BADGE: [
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
                        vertical: "top",
                        horizontal: "left"
                    },
                    "HIDDEN": {
                        hidden: true
                    }
                })
            ]
        };
    }

    private async _getAccounts(account: Account): Promise<Account[]> {
        const key = `${account.domainId}/${account.name}`;

        if (!this._accounts.has(key)) {
            this._accounts.set(key, this._contract.getAccounts(account));
        }

        return this._accounts.get(key);
    }

    public activate() {
        this.adapter.attachFeature(this);
    }

    public deactivate() {
        this.adapter.detachFeature(this);
    }
}