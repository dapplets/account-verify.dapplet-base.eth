import { Bus } from "./bus";

export type Profile = {
    authorFullname: string;
    authorUsername: string;
    authorImg: string;
}

export type Settings = {
    contractAddress: string;
    oracleAddress: string;
}

export type UnsignedProve = string;
export type SignedProve = string;

class DappletBus extends Bus {
    _subId: number = 0;

    onProfileSelect(callback: (profile: Profile & Settings) => void) {
        this.subscribe('profile_select', (profile: Profile & Settings) => {
            callback(profile);
            return (++this._subId).toString();
        });
    }

    onProvePublished(callback: (proveUrl: string) => void) {
        this.subscribe('prove_published', callback);
    }

    async signProve(prove: UnsignedProve): Promise<SignedProve> {
        return this.call('sign_prove', prove, 'prove_signed');
    }

    async getAccount(): Promise<string> {
        return this.call('get_account', null, 'current_account');
    }

    async sendTransaction(tx: any): Promise<string> {
        return this.call('send_transaction', tx, 'transaction_result');
    }

    public async call(method: string, args: any, callbackEvent: string): Promise<any> {
        return new Promise((res, rej) => {
            this.publish(this._subId.toString(), {
                type: method,
                message: args
            });
            this.subscribe(callbackEvent, (result: any) => {
                this.unsubscribe(callbackEvent);
                res(result);
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