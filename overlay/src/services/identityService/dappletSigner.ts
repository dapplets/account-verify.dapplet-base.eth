import * as ethers from "ethers";
import { dappletInstance } from '../../dappletBus';

export class DappletSigner extends ethers.Signer {
    public provider = ethers.getDefaultProvider('rinkeby');

    async getAddress(): Promise<string> {
        const account = await dappletInstance.getAccount();
        return account || '0x0000000000000000000000000000000000000000';
    }

    signMessage(message: ethers.utils.Arrayish): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse> {
        transaction.from = await this.getAddress();
        const tx = await ethers.utils.resolveProperties(transaction);
        const txHash = await dappletInstance.sendTransaction(tx as any);
        return await this.provider.getTransaction(txHash);
    }
}