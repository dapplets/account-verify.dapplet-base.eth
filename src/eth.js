const secondStepBtn = document.getElementById('ISSecondStepAction');
// PROJECT_ID = 'e2bcd86213da4237822976f3b59ed83a',
// PROJECT_SECRET = '1652eee42ea949ae8754fc330b8b2647',
// MAINNET_URL = 'https://mainnet.infura.io/v3/e2bcd86213da4237822976f3b59ed83a',
// RINKEBY_URL = 'https://rinkeby.infura.io/v3/e2bcd86213da4237822976f3b59ed83a',
// address = '0x0f85b07e253C85B5B86Cd646535A6655308Ab719',
// address2 = '0xA89F684D15d73342680953C176ec8532c2101B00';

// console.log('wallet', wallet);

// let infuraProvider = new ethers.providers.InfuraProvider('rinkeby');
// infuraProvider.apiAccessToken = PROJECT_ID;
//let provider = 
//ethers.getDefaultProvider('rinkeby');

// const ens = new ENS({networkURL: 'https://mainnet.infura.io/v3/e2bcd86213da4237822976f3b59ed83a'});
// ens.init('whoisens.eth');
// ens.getOwner('VictorZhang.eth').then((transactionCount) => {
//     console.log("Whois " , transactionCount);
// });


// let provider = new ethers.providers.JsonRpcProvider({
//     url: MAINNET_URL
//     //url: RINKEBY_URL
// });

// provider.personal_sign('Twiiter account xiulga ens xiulga.eth', address).then((msg) => {
//     console.log("msg", msg);
// });


// provider.getBalance(address2).then((balance) => {

//     // balance is a BigNumber (in wei); format is as a sting (in ether)
//     let etherString = ethers.utils.formatEther(balance);

//     console.log("Balance: " + etherString);
// });

// provider.getTransactionCount(address2).then((transactionCount) => {
//     console.log("Total Transactions Ever Sent: " + transactionCount);
// });


// provider.resolveName('xiulga.eth').then((ens) => {
//     console.log('address', ens);
// });
// import { ecrecover } from './bundle.js'
// console.log('ecrecover ', ecrecover);

function parseSignature(signature) {
    var r = signature.substring(0, 64);
    var s = signature.substring(64, 128);
    var v = signature.substring(128, 130);

    return {
        r: "0x" + r,
        s: "0x" + s,
        v: parseInt(v, 16)
    }
}


// for (let key in web3.eth) {
//     let str = key.toString().includes('pub');
//     console.log('key', str);
//     console.log('value', web3[key]);
// }


secondStepBtn.addEventListener('click', e => {
    const contextObj = JSON.parse(window.localStorage.getItem('contextObj')).message;
    const domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" },
    ];
    const bid = [
        { name: "text", type: "string" },
        { name: "twitter", type: "Account" },
        { name: "ENS", type: "Account" },
    ];

    const account = [
        { name: "name", type: "string" }
    ];

    const domainData = {
        name: "Identity Service",
        version: "2",
        chainId: 4,
        verifyingContract: "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070",
        salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
    };
    var message = {
        text: 'This message confirms the creation of a bind between ENS and twitter`s account',
        twitter: {
            name: contextObj.authorUsername
        },
        ENS: {
            name: 'xiulga.eth'
        }
    };

    const data = JSON.stringify({
        types: {
            EIP712Domain: domain,
            Bid: bid,
            Account: account
        },
        domain: domainData,
        primaryType: "Bid",
        message: message
    });

    console.log(data);
    const signer = web3.currentProvider.selectedAddress;
    web3.currentProvider.enable();
    web3.currentProvider.sendAsync(
        {
            method: "eth_signTypedData_v3",
            params: [signer, data],
            from: signer
        },
        function (err, result) {
            if (err || result.error) {
                return console.error(result);
            }

            const signature = parseSignature(result.result.substring(2));

            console.log('msgHash', data);
            console.log('signature', signature);

            window.localStorage.setItem('msgHash', data);
            window.localStorage.setItem('signature', signature);
            window.localStorage.setItem('chainId', '1');
        }
    );

});




