pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

contract Verifier {
    uint256 constant chainId = 1;
    address constant verifyingContract = 0x1C56346CD2A2Bf3202F771f50d3D14a367B48070;
    bytes32 constant salt = 0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558;
    
    string private constant EIP712_DOMAIN  = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)";
    string private constant IDENTITY_TYPE = "Identity(uint256 userId,address wallet)";
    string private constant BID_TYPE = "Bid(uint256 amount,Identity bidder)Identity(uint256 userId,address wallet)";
    
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));
    bytes32 private constant IDENTITY_TYPEHASH = keccak256(abi.encodePacked(IDENTITY_TYPE));
    bytes32 private constant BID_TYPEHASH = keccak256(abi.encodePacked(BID_TYPE));
    bytes32 private constant DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
        keccak256("My amazing dApp"),
        keccak256("2"),
        chainId,
        verifyingContract,
        salt
    ));
    
    mapping (uint => uint) linkedNames
    
    struct Identity {
        string networkId;
        string account;
    }
    
    struct NameLink {
        Identity ensName;
        Identity account;
    }
    
    function hashSocAccount(Identity memory identity) private pure returns (bytes32) {
        return keccak256(abi.encode(
            IDENTITY_TYPEHASH,
            identity.socNetwork,
            identity.account
        ));
    }
    
    function hashNameLink(NameLink memory link) private pure returns (bytes32){
        return keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                BID_TYPEHASH,
                link.ensName,
                hashSocAccount(link.account)
            ))
        ));
    }
    
    function verify(public string ensName, public string socNetwork, public string account, public bytes32 R, public bytes32 S, public uint8 V) public pure returns (bool) {
        Identity memory ensName = Identity({
            networkId: MAINNET,
            account: ensName
        });

        Identity memory socialId = Identity({
            networkId: socNetwork,
            account: account
        });

        NameLink memory link = NameLink({
            ensName: ensName,
            account: socialId
        });
        
        address signer == ecrecover(hashNameLink(link), V, R, S);
        address ensOwner = ENS.registry(ensName).addr(); // ToDo: find how it should work
        assert signer == ensOwner
        
        // TODO: assert ensName == Owner
        linkedNames[signer] = account
        
    }
}