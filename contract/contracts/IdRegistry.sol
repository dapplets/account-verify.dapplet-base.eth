pragma solidity ~0.6.7;
pragma experimental ABIEncoderV2;

contract IdRegistry {
    struct Account {
        uint8 domainId;
        string name;
    }
    
    mapping(bytes32 => Account[]) public accounts;

    function addAccount(Account memory oldAccount, Account memory newAccount) public {
        bytes32 oldKey = keccak256(abi.encodePacked(oldAccount.domainId, oldAccount.name));
        if (accounts[oldKey].length == 0) accounts[oldKey].push(oldAccount);
        accounts[oldKey].push(newAccount);
        bytes32 newKey = keccak256(abi.encodePacked(newAccount.domainId, newAccount.name));
        accounts[newKey] = accounts[oldKey];
    }
    
    function getAccounts(Account memory account) public view returns (Account[] memory) {
        bytes32 key = keccak256(abi.encodePacked(account.domainId, account.name));
        return accounts[key];
    }
}