pragma solidity ~0.6.7;
pragma experimental ABIEncoderV2;

contract IdRegistry {
    enum AccountStatus { NoIssues, Exception, Scammer }

    struct Account {
        uint8 domainId;
        string name;
        AccountStatus status;
    }

    struct AccountDto {
        uint8 domainId;
        string name;
    }

    enum ClaimStatus { InProgress, Approved, Rejected, Canceled }

    /*
        claimTypes codes:
        0 - no claims
        1 - account mimics another one
        2 - unusual behaviour
        4 - produces too many scams
        8 - unused
        16 - unused
        32 - unused
        64 - unused
        128 - unused
    */

    struct Claim {
        uint8 claimTypes; // mask
        bytes link; // swarm url
        address oracle;
        address author;
        bytes32 accountKey;
        ClaimStatus status;
        uint timestamp;
    }
    
    Account[][] public accounts;
    mapping(bytes32 => uint) public accountIdxs;
    mapping(bytes32 => uint[]) public claimIdxByAccount;
    mapping(address => uint[]) public claimIdxByOracle;
    Claim[] claims;

    constructor() public {
        accounts.push(); // lock zero index
    }

    function addAccount(AccountDto memory oldAccount, AccountDto memory newAccount) public {
        bytes32 oldKey = keccak256(abi.encodePacked(oldAccount.domainId, oldAccount.name));
        bytes32 newKey = keccak256(abi.encodePacked(newAccount.domainId, newAccount.name));
        uint oldKeyIdx = accountIdxs[oldKey];
        uint newKeyIdx = accountIdxs[newKey];

        require(oldKeyIdx == 0 || newKeyIdx == 0, "Merging of two tuples is not implemented");

        // new oldAccount
        if (oldKeyIdx == 0 && newKeyIdx == 0) {
            Account[] storage tuple = accounts.push();
            tuple.push(Account(oldAccount.domainId, oldAccount.name, AccountStatus.NoIssues));
            tuple.push(Account(newAccount.domainId, newAccount.name, AccountStatus.NoIssues));
            oldKeyIdx = accounts.length - 1;
            accountIdxs[oldKey] = oldKeyIdx;
            accountIdxs[newKey] = oldKeyIdx;
        } else if (oldKeyIdx == 0 && newKeyIdx != 0) {
            accounts[newKeyIdx].push(Account(oldAccount.domainId, oldAccount.name, AccountStatus.NoIssues));
            accountIdxs[oldKey] = newKeyIdx;
        } else if (oldKeyIdx != 0 && newKeyIdx == 0) {
            accounts[oldKeyIdx].push(Account(newAccount.domainId, newAccount.name, AccountStatus.NoIssues));
            accountIdxs[newKey] = oldKeyIdx;
        }
    }
    
    function getAccounts(AccountDto memory account) public view returns (Account[] memory) {
        bytes32 key = keccak256(abi.encodePacked(account.domainId, account.name));
        uint keyIdx = accountIdxs[key];
        return accounts[keyIdx];
    }
    
    function removeAccount(AccountDto memory oldAccount, AccountDto memory newAccount) public {
        bytes32 oldKey = keccak256(abi.encodePacked(oldAccount.domainId, oldAccount.name));
        uint oldKeyIdx = accountIdxs[oldKey];

        bytes32 newKey = keccak256(abi.encodePacked(newAccount.domainId, newAccount.name));
        
        for (uint i = 0; i < accounts[oldKeyIdx].length; ++i) {
            bytes32 removeKey = keccak256(abi.encodePacked(accounts[oldKeyIdx][i].domainId, accounts[oldKeyIdx][i].name));
            if (removeKey == newKey) {
                accounts[oldKeyIdx][i] = accounts[oldKeyIdx][accounts[oldKeyIdx].length - 1];
                accounts[oldKeyIdx].pop();
                delete accountIdxs[newKey];
            }
        }
    }

    function createClaim(uint8 claimTypes, bytes memory link, AccountDto memory account, address oracle) public returns (uint) {
        bytes32 key = keccak256(abi.encodePacked(account.domainId, account.name));
        uint keyIdx = accountIdxs[key];
        
        // new account
        if (keyIdx == 0) {
            accounts.push().push(Account(account.domainId, account.name, AccountStatus.NoIssues));
            keyIdx = accounts.length - 1;
        }
        
        claims.push(Claim(claimTypes, link, oracle, msg.sender, key, ClaimStatus.InProgress, block.timestamp));

        // ToDo: event
        uint idx = claims.length - 1;
        claimIdxByAccount[key].push(idx);
        claimIdxByOracle[oracle].push(idx);
    }

    function cancelClaim(uint id) public {
        require(claims[id].author == msg.sender, "The claim can be canceled by author only");
        claims[id].status = ClaimStatus.Canceled;
        // ToDo: event
    }

    function approveClaim(uint id) public {
        require(claims[id].oracle == msg.sender, "The claim can be approved by oracle only");
        require(claims[id].status != ClaimStatus.Canceled, "Can not approve canceled claim");
        require(accountIdxs[claims[id].accountKey] != 0, "Account is not exist");

        bytes32 accountKey = claims[id].accountKey;
        uint accountIdx = accountIdxs[accountKey];
        
        for (uint i = 0; i < accounts[accountIdx].length; ++i) {
            Account storage account = accounts[accountIdx][i];
            bytes32 key = keccak256(abi.encodePacked(account.domainId, account.name));

            if (accountKey == key) {
                uint8 claimTypes = claims[id].claimTypes;

                if (claimTypes == 0) {
                    account.status = AccountStatus.NoIssues;
                } else if (claimTypes & 1 == 1) { // account mimics another one
                    account.status = AccountStatus.Scammer;
                } else if (claimTypes & 2 == 2) { // unusual behaviour
                    account.status = AccountStatus.Exception;
                } else if (claimTypes & 4 == 4) { // produces too many scams
                    account.status = AccountStatus.Scammer;
                }
                
                claims[id].status = ClaimStatus.Approved;
                // ToDo: event
                break;
            }
        }

    }
    
    function rejectClaim(uint id) public {
        require(claims[id].oracle == msg.sender, "The claim can be rejected by oracle only");
        require(claims[id].status != ClaimStatus.Canceled, "Can not reject canceled claim");
        claims[id].status = ClaimStatus.Rejected;
    }

    function getClaimsByAccount(AccountDto memory account) public view returns (Claim[] memory output, uint[] memory indexes) {
        bytes32 key = keccak256(abi.encodePacked(account.domainId, account.name));
        indexes = claimIdxByAccount[key];
        output = _getClaimsByIndexes(indexes);
    }

    function getClaimsByOracle(address oracle) public view returns (Claim[] memory output, uint[] memory indexes) {
        indexes = claimIdxByOracle[oracle];
        output = _getClaimsByIndexes(indexes);
    }

    function _getClaimsByIndexes(uint[] memory indexes) private view returns (Claim[] memory output) {
        output = new Claim[](indexes.length);
        for (uint i = 0; i < indexes.length; i++) {
            output[i] = claims[indexes[i]];
        }
    }
}