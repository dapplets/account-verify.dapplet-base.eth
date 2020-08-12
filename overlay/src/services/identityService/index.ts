import * as ethers from 'ethers';
import abi from './abi';
import { DappletSigner } from './dappletSigner';
import { dappletInstance } from '../../dappletBus';

export enum AccountStatus {
    NoIssues,
    Exception,
    Scammer
}

export enum ClaimStatus {
    InProgress, 
    Approved, 
    Rejected, 
    Canceled
}

export enum ClaimTypes {
    NoIssues = 0,
    AccountMimicsAnotherOne = 1,
    UnusualBehaviour = 2,
    ProducesTooManyScams = 4
}

export type Account = {
    domainId: number; // 1 - twitter, 2 - ens
    name: string;
    status?: AccountStatus;
}

export type Claim = {
    id: number;
    claimTypes: number;
    link: string | null;
    oracle: string;
    author: string;
    accountIdx: number;
    status: ClaimStatus;
    timestamp: Date;
}

export class IdentityService {

    private _contract: ethers.Contract;

    constructor(contractAddress: string) {
        const signer = ethers.getDefaultProvider('rinkeby'); //new DappletSigner();
        this._contract = new ethers.Contract(contractAddress, abi, signer);
    }

    async getAccounts(account: Account): Promise<Account[]> {
        return this._contract.getAccounts(account);
    }

    async addAccount(oldAccount: Account, newAccount: Account) {
        return dappletInstance.call('addAccount', [oldAccount, newAccount], 'addAccount_done');
    }

    async removeAccount(oldAccount: Account, newAccount: Account) {
        return dappletInstance.call('removeAccount', [oldAccount, newAccount], 'removeAccount_done');
    }

    async createClaim(claimTypes: number, link: string | null, account: Account, oracle: string) {
        const linkBytes = link ? '0x' + link : '0x0';
        return dappletInstance.call('createClaim', [claimTypes, linkBytes, account, oracle], 'createClaim_done');
    }

    async cancelClaim(id: number) {
        return dappletInstance.call('cancelClaim', [id], 'cancelClaim_done');
    }

    async approveClaim(id: number) {
        return dappletInstance.call('approveClaim', [id], 'approveClaim_done');
    }

    async rejectClaim(id: number) {
        return dappletInstance.call('rejectClaim', [id], 'rejectClaim_done');
    }

    async getClaimsByAccount(account: Account): Promise<Claim[]> {
        const [claims, indexes] = await this._contract.getClaimsByAccount(account);
        claims.forEach((c: Claim, i: number) => c.id = indexes[i].toNumber());
        claims.forEach((c: Claim) => c.link = (c.link === null || c.link === '0x' || c.link === '0x0' || c.link === '0x00') ? null : c.link.substring(2));
        claims.forEach((c: any) => c.timestamp = new Date(c.timestamp.toNumber() * 1000));
        return claims;
    }

    async getClaimsByOracle(oracle: string): Promise<Claim[]> {
        const [claims, indexes] = await this._contract.getClaimsByOracle(oracle);
        claims.forEach((c: Claim, i: number) => c.id = indexes[i].toNumber());
        claims.forEach((c: Claim) => c.link = (c.link === null  || c.link === '0x' || c.link === '0x0' || c.link === '0x00') ? null : c.link.substring(2));
        claims.forEach((c: any) => c.timestamp = new Date(c.timestamp.toNumber() * 1000));
        return claims;
    }
}