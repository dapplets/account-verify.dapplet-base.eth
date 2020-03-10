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

    constructor() {
        const overlay = Core.overlay({ url: 'https://localhost:10001/src/index.html', title: 'Identity Service' });
        const { badge, button } = this.adapter.widgets;
        const { popup } = this.adapter2.widgets;

        this.config = {
            TWEET_SOUTH: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: PICTURE,
                        label: '',
                        exec: (ctx) => {
                            console.log(ctx);
                            overlay.sendAndListen('tweet_select', ctx, {});
                        }
                    }
                })
            ],
            PROFILE_BUTTON_GROUP: [
                button({
                    initial: "DEFAULT",
                    "DEFAULT": {
                        img: PICTURE,
                        label: '',
                        exec: (ctx) => {
                            overlay.sendAndListen('tweet_select', ctx, {});
                        }
                    }
                })
                // badge({
                //     initial: "DEFAULT",
                //     "DEFAULT": {
                //         hidden: true,
                //         init: (ctx, me) => {
                //             //if (ctx.authorUsername === "@Ethernian") {
                //                 me.setState("HIDDEN");
                //             //}
                //         }        
                //     },
                //     "HIDDEN": {
                //         hidden: false,
                //         img: PICTURE,
                //         //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
                //         vertical: "top",
                //         horizontal: "left"
                //     }
                // })
            ],
            // TWEET_AVATAR_BADGE: [
            //     badge({
            //         initial: "DEFAULT",
            //         "DEFAULT": {
            //             hidden: true,
            //             init: (ctx, me) => {
            //                 //if (ctx.authorUsername === "@Ethernian") {
            //                     me.setState("HIDDEN");
            //                 //}
            //             },
            //             // exec: (ctx, me) => { // ToDo: rename exec() to onclick()
                            
            //             //     console.log('default exec', me, ctx);
            //             //     me.setState("DISABLED");
            //             // }        
            //         },
            //         "HIDDEN": {
            //             hidden: false,
            //             img: WARNING,
            //             //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
            //             vertical: "bottom",
            //             horizontal: "left" 
            //         }
            //         // ,"DISABLED": {
            //         //     hidden: false,
            //         //     img: STAR_ICON,
            //         //     //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
            //         //     vertical: "top",
            //         //     horizontal: "left",
            //         //     init: (ctx, me) => {
            //         //         console.log('disabled', me, ctx)
            //         //     }  
            //         // }
            //     })
            // ],
            // TWEET_USERNAME_BADGE:  [
            //     badge({
            //         initial: "DEFAULT",
            //         "DEFAULT": {
            //             hidden: true,
            //             init: (ctx, me) => {
            //                 //if (ctx.authorUsername === "@Ethernian") {
            //                     me.setState("HIDDEN");
            //                 //}
            //             }        
            //         },
            //         "HIDDEN": {
            //             hidden: false,
            //             img: CHECKED_ICON_SHIELD,
            //             //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
            //             vertical: "top",
            //             horizontal: "right"
            //         }
            //     })
            // ],
            // HEADING_USERNAME_BADGE:  [
            //     badge({
            //         initial: "DEFAULT",
            //         "DEFAULT": {
            //             hidden: true,
            //             init: (ctx, me) => {
            //                 //if (ctx.authorUsername === "@Ethernian") {
            //                     me.setState("HIDDEN");
            //                 //}
            //             }        
            //         },
            //         "HIDDEN": {
            //             hidden: false,
            //             img: CHECKED_ICON_SHIELD,
            //             //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
            //             vertical: "top",
            //             horizontal: "left"
            //         }
            //     })
            // ],
            // PROFILE_USERNAME_BADGE:  [
            //     badge({
            //         initial: "DEFAULT",
            //         "DEFAULT": {
            //             hidden: true,
            //             init: (ctx, me) => {
            //                 //if (ctx.authorUsername === "@Ethernian") {
            //                     me.setState("HIDDEN");
            //                 //}
            //             }        
            //         },
            //         "HIDDEN": {
            //             hidden: false,
            //             img: CHECKED_ICON_SHIELD_YELLOW,
            //             //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
            //             vertical: "top",
            //             horizontal: "left"
            //         }
            //     })
            // ],
            // PROFILE_AVATAR_BADGE:  [
            //     badge({
            //         initial: "DEFAULT",
            //         "DEFAULT": {
            //             hidden: true,
            //             init: (ctx, me) => {
            //                 //if (ctx.authorUsername === "@Ethernian") {
            //                     me.setState("HIDDEN");
            //                 //}
            //             }        
            //         },
            //         "HIDDEN": {
            //             hidden: false,
            //             img: CHECKED_ICON_SHIELD_YELLOW,
            //             //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
            //             vertical: "top",
            //             horizontal: "left"
            //         }
            //     })
            // ],
            
          
            // SUSPENDED_USERNAME_BADGE:  [
            //     badge({
            //         initial: "DEFAULT",
            //         "DEFAULT": {
            //             hidden: true,
            //             init: (ctx, me) => {
            //                 //if (ctx.authorUsername === "@Ethernian") {
            //                     me.setState("HIDDEN");
            //                 //}
            //             }        
            //         },
            //         "HIDDEN": {
            //             hidden: false,
            //             img: CHECKED_ICON_SHIELD_YELLOW,
            //             //img: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA3OTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MTIgNzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM0MUFENDk7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01NjIsMzk2YzAtMTQxLjQtMTE0LjYtMjU2LTI1Ni0yNTZTNTAsMjU0LjYsNTAsMzk2czExNC42LDI1NiwyNTYsMjU2UzU2Miw1MzcuNCw1NjIsMzk2TDU2MiwzOTZ6ICAgIE01MDEuNywyOTYuM2wtMjQxLDI0MWwwLDBsLTE3LjIsMTcuMkwxMTAuMyw0MjEuM2w1OC44LTU4LjhsNzQuNSw3NC41bDE5OS40LTE5OS40TDUwMS43LDI5Ni4zTDUwMS43LDI5Ni4zeiIvPjwvZz48L3N2Zz4=",
            //             vertical: "top",
            //             horizontal: "left"
            //         }
            //     })
            // ],
            // BODY: [
            //     popup({
            //         initial: "DEFAULT",
            //         "DEFAULT": {
            //             text: 'I was banned! You can find me at Google https://google.com',
            //             img: PICTURE,
            //             link: 'https://google.com'
            //         }
            //     })
            // ]
        };
    }

    public activate() {
        this.adapter.attachFeature(this);
    }

    public deactivate() {
        this.adapter.detachFeature(this);
    }
}