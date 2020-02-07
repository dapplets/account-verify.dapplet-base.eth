import { IFeature } from '@dapplets/dapplet-extension'
import { sayHello } from './helper';
import CHECKED_ICON from './check_circle.svg'
import CLOSE_ICON from './close_circle.svg'
import STAR_ICON from './star_circle.svg'

@Injectable
export default class Feature implements IFeature {

    @Inject("twitter-adapter.dapplet-base.eth")
    public adapter: any; // ITwitterAdapter;
    public config: any; // T_TwitterFeatureConfig;

    constructor() {
        const server = Core.connect<{ pm_num: string }>({ url: "wss://localhost:8080/feature-1" });
        const { button, badge, profile } = this.adapter.widgets;
        this.config = {
            AVATAR_BADGE: [
                badge({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx, me) => {
                            //if (ctx.authorUsername === "@Ethernian") {
                                me.setState("HIDDEN");
                            //}
                        }        
                    },
                    "HIDDEN": {
                        hidden: false,
                        img: CHECKED_ICON,
                        //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
                        vertical: "top",
                        horizontal: "left",
                    }
                })
            ],
            USERNAME_BADGE:  [
                badge({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx, me) => {
                            //if (ctx.authorUsername === "@Ethernian") {
                                me.setState("HIDDEN");
                            //}
                        }        
                    },
                    "HIDDEN": {
                        hidden: false,
                        img: CHECKED_ICON,
                        //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
                        vertical: "top",
                        horizontal: "left"
                    }
                })
            ],
            PROFILE_USERNAME_BADGE:  [
                profile({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx, me) => {
                            //if (ctx.authorUsername === "@Ethernian") {
                                me.setState("HIDDEN");
                            //}
                        }        
                    },
                    "HIDDEN": {
                        hidden: false,
                        img: STAR_ICON,
                        //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
                        vertical: "top",
                        horizontal: "left"
                    }
                })
            ],
            PROFILE_AVATAR_BADGE:  [
                profile({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        hidden: true,
                        init: (ctx, me) => {
                            //if (ctx.authorUsername === "@Ethernian") {
                                me.setState("HIDDEN");
                            //}
                        }        
                    },
                    "HIDDEN": {
                        hidden: false,
                        img: STAR_ICON,
                        //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
                        vertical: "top",
                        horizontal: "left"
                    }
                })
            ],
        };
    }

    public activate() {
        this.adapter.attachFeature(this);
    }

    public deactivate() {
        this.adapter.detachFeature(this);
    }
}