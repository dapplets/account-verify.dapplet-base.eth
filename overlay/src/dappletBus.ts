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

    onProveSigned(callback: (prove: SignedProve) => void) {
        this.subscribe('prove_signed', callback);
    }

    onProvePublished(callback: (proveUrl: string) => void) {
        this.subscribe('prove_published', callback);
    }

    signProve(prove: UnsignedProve) {
        this.publish(this._subId.toString(), {
            type: 'sign_prove',
            message: prove
        });
    }
}

const dappletInstance = new DappletBus();

export {
    dappletInstance,
    DappletBus
};