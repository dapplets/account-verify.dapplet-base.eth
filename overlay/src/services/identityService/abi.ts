export default [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "accounts",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "domainId",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "domainId",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "internalType": "struct IdRegistry.Account",
                "name": "oldAccount",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "domainId",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "internalType": "struct IdRegistry.Account",
                "name": "newAccount",
                "type": "tuple"
            }
        ],
        "name": "addAccount",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "domainId",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "internalType": "struct IdRegistry.Account",
                "name": "account",
                "type": "tuple"
            }
        ],
        "name": "getAccounts",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "domainId",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "internalType": "struct IdRegistry.Account[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "domainId",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "internalType": "struct IdRegistry.Account",
                "name": "oldAccount",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "domainId",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "internalType": "struct IdRegistry.Account",
                "name": "newAccount",
                "type": "tuple"
            }
        ],
        "name": "removeAccount",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];