import * as ethers from 'ethers';
import abi from './abi';
import { DappletSigner } from './dappletSigner';

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
        const signer = new DappletSigner();
        this._contract = new ethers.Contract(contractAddress, abi, signer);
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

    async createClaim(claimTypes: number, link: string | null, account: Account, oracle: string) {
        const linkBytes = link ? '0x' + link : '0x0';
        const tx = await this._contract.createClaim(claimTypes, linkBytes, account, oracle);
        await tx.wait();
    }

    async cancelClaim(id: number) {
        const tx = await this._contract.cancelClaim(id);
        await tx.wait();
    }

    async approveClaim(id: number) {
        const tx = await this._contract.approveClaim(id);
        await tx.wait();
    }

    async rejectClaim(id: number) {
        const tx = await this._contract.rejectClaim(id);
        await tx.wait();
    }

    async getClaimsByAccount(account: Account): Promise<Claim[]> {
        const [claims, indexes] = await this._contract.getClaimsByAccount(account);
        claims.forEach((c: Claim, i: number) => c.id = indexes[i].toNumber());
        claims.forEach((c: Claim) => c.link = (c.link === null  || c.link === '0x') ? null : c.link.substring(2));
        claims.forEach((c: any) => c.timestamp = new Date(c.timestamp.toNumber() * 1000));
        return claims;
    }

    async getClaimsByOracle(oracle: string): Promise<Claim[]> {
        const [claims, indexes] = await this._contract.getClaimsByOracle(oracle);
        claims.forEach((c: Claim, i: number) => c.id = indexes[i].toNumber());
        claims.forEach((c: Claim) => c.link = (c.link === null  || c.link === '0x') ? null : c.link.substring(2));
        claims.forEach((c: any) => c.timestamp = new Date(c.timestamp.toNumber() * 1000));
        return claims;
    }
}