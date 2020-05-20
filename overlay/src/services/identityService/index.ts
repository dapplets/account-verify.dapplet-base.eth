import * as ethers from 'ethers';
import abi from './abi';
import { DappletSigner } from './dappletSigner';

export type Account = {
    domainId: number; // 1 - twitter, 2 - ens
    name: string;
}

export class IdentityService {

    private _contract: ethers.Contract;
    
    constructor() {
        const signer = new DappletSigner();
        this._contract = new ethers.Contract('0x78E2ef829b573BC814A3C29630717548AfB2186D', abi, signer);
    }

    getAccounts(account: Account): Promise<Account[]> {
        return this._contract.getAccounts(account);
    }

    async addAccount(oldAccount: Account, newAccount: Account) {
        const tx = await this._contract.addAccount(oldAccount, newAccount);
        await tx.wait();
    }

    async removeAccount(oldAccount: Account, newAccount: Account) {
        const tx = await this._contract.removeAccount(oldAccount, newAccount);
        await tx.wait();
    }
}