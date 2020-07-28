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
        bytes32 accountIdx;
        ClaimStatus status;
        uint timestamp;
    }
    
    mapping(bytes32 => Account[]) public accounts;
    mapping(bytes32 => uint[]) public claimIdxByAccount;
    mapping(address => uint[]) public claimIdxByOracle;
    Claim[] claims;

    function addAccount(AccountDto memory oldAccount, AccountDto memory newAccount) public {
        bytes32 oldKey = keccak256(abi.encodePacked(oldAccount.domainId, oldAccount.name));
        if (accounts[oldKey].length == 0) accounts[oldKey].push(Account(oldAccount.domainId, oldAccount.name, AccountStatus.NoIssues));
        accounts[oldKey].push(Account(newAccount.domainId, newAccount.name, AccountStatus.NoIssues));
        bytes32 newKey = keccak256(abi.encodePacked(newAccount.domainId, newAccount.name));
        accounts[newKey] = accounts[oldKey];
    }
    
    function getAccounts(AccountDto memory account) public view returns (Account[] memory) {
        return accounts[keccak256(abi.encodePacked(account.domainId, account.name))];
    }
    
    function removeAccount(AccountDto memory oldAccount, AccountDto memory newAccount) public {
        bytes32 oldKey = keccak256(abi.encodePacked(oldAccount.domainId, oldAccount.name));
        bytes32 newKey = keccak256(abi.encodePacked(newAccount.domainId, newAccount.name));
        
        for (uint i = 0; i < accounts[oldKey].length; ++i) {
            bytes32 removeKey = keccak256(abi.encodePacked(accounts[oldKey][i].domainId, accounts[oldKey][i].name));
            if (removeKey == newKey) {
                accounts[oldKey][i] = accounts[oldKey][accounts[oldKey].length - 1];
                accounts[oldKey].pop();
                delete accounts[removeKey];
            }
        }
    }

    function createClaim(uint8 claimTypes, bytes memory link, AccountDto memory account, address oracle) public returns (uint) {
        bytes32 key = keccak256(abi.encodePacked(account.domainId, account.name));
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
        claims[id].status = ClaimStatus.Approved;
        uint8 claimTypes = claims[id].claimTypes;
        Account storage account = accounts[claims[id].accountIdx][0];

        if (claimTypes == 0) {
            account.status = AccountStatus.NoIssues;
        } else if (claimTypes & 1 == 1) { // account mimics another one
            account.status = AccountStatus.Scammer;
        } else if (claimTypes & 2 == 2) { // unusual behaviour
            account.status = AccountStatus.Exception;
        } else if (claimTypes & 4 == 4) { // produces too many scams
            account.status = AccountStatus.Scammer;
        }
        // ToDo: event
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