import { IFeature } from '@dapplets/dapplet-extension'
import CHECKED_ICON_SHIELD from './check_circle_shield.svg'
import CHECKED_ICON_SHIELD_YELLOW from './check_circle_shield_yellow.svg'
import PICTURE from './picture.png';
import WARNING from './warning.svg'
// import CLOSE_ICON from './close_circle.svg'
// import CHECKED_ICON from './check_circle.svg'
// import { sayHello } from './helper';

@Injectable
export default class Feature implements IFeature {

    @Inject("twitter-adapter.dapplet-base.eth")
    public adapter: any; // ITwitterAdapter;
    @Inject("common-adapter.dapplet-base.eth")
    public adapter2: any; // ITwitterAdapter;
    public config: any; // T_TwitterFeatureConfig;

    private _currentProve: string = null;

    constructor() {
        const wallet = Core.wallet();
        const overlay = Core.overlay({ url: 'https://localhost:3000', title: 'Identity Service' });
        const { badge, button } = this.adapter.widgets;
        const { popup } = this.adapter2.widgets;

        this.config = {
            PROFILE_BUTTON_GROUP: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: PICTURE,
                        label: '',
                        exec: (ctx) => {
                            overlay.sendAndListen('profile_select', ctx, {
                                'sign_prove': (op, msg) => {
                                    // wallet.sendAndListen('1', ctx, {
                                    //     rejected: () => me.state = 'ERR',
                                    //     created: () => {
                                    //         me.state = 'DEFAULT';
                                    //         overlay.send('tx_created');
                                    //     }
                                    // });

                                    this._currentProve = `test`;
                                    setTimeout(() => overlay.send('prove_signed', this._currentProve), 3000);
                                }
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
            ]
        };
    }

    public activate() {
        this.adapter.attachFeature(this);
    }

    public deactivate() {
        this.adapter.detachFeature(this);
    }
}