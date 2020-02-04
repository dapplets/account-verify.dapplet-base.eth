import { IFeature } from '@dapplets/dapplet-extension'
import { sayHello } from './helper';
import CHECKED_ICON from './check_circle.svg'

@Injectable
export default class Feature implements IFeature {

    @Inject("twitter-adapter.dapplet-base.eth")
    public adapter: any; // ITwitterAdapter;
    public config: any; // T_TwitterFeatureConfig;

    constructor() {
        const server = Core.connect<{ pm_num: string }>({ url: "wss://localhost:8080/feature-1" });
        const { button, badge } = this.adapter.widgets;
        this.config = {
            AVATAR_BADGE: [
                badge({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx, me) => {
                            if (ctx.authorUsername === "@Ethernian") {
                                me.setState("HIDDEN");
                            }
                        }        
                    },
                    "HIDDEN": {
                        hidden: false,
                        img: CHECKED_ICON,
                        vertical: "bottom",
                        horizontal: "right",
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