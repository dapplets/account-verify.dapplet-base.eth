import { Bus } from "./bus";

export type Profile = {
    authorFullname: string;
    authorUsername: string;
    authorImg: string;
}

export type UnsignedProve = string;
export type SignedProve = string;

class DappletBus extends Bus {
    _subId: number = 0;

    onProfileSelect(callback: (profile: Profile) => void) {
        this.subscribe('profile_select', (profile: Profile) => {
            callback(profile);
            return (++this._subId).toString();
        });
    }

    onProvePublished(callback: (proveUrl: string) => void) {
        this.subscribe('prove_published', callback);
    }

    async signProve(prove: UnsignedProve): Promise<SignedProve> {
        return new Promise((res, rej) => {
            this.publish(this._subId.toString(), {
                type: 'sign_prove',
                message: prove
            });
            this.subscribe('prove_signed', (data: any) => {
                this.unsubscribe('prove_signed');
                res(data);
                // ToDo: add reject call
            });
        });
    }

    async getAccount(): Promise<string> {
        return new Promise((res, rej) => {
            this.publish(this._subId.toString(), {
                type: 'get_account'
            });
            this.subscribe('current_account', (data: any) => {
                this.unsubscribe('current_account');
                res(data);
                // ToDo: add reject call
            });
        });
    }
}

const dappletInstance = new DappletBus();

export {
    dappletInstance,
    DappletBus
};