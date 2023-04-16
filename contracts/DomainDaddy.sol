// SPDX-License-Identifier: UNLICENSED
// List Domain
// Buy Domain
// Get paid on domain purchase

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DomainDaddy is ERC721 {

    address public owner;
    uint256 public maxSupply;
    uint256 public totalSupply;
    
    // Model Domain
    struct Domain {
        string name;
        uint256 cost;
        bool isPurchased;
    }

    // Map Domain
    mapping(uint256 => Domain) domains;

    modifier domainOwner () {
        require((msg.sender == owner));
        _; // Run the function body
    }
    
    constructor (string memory _name , string memory _symbol) ERC721(_name , _symbol)        
    {
        owner = msg.sender;
    }

    // function List Domains
    function list(string memory _name , uint256 _cost) public domainOwner {
        maxSupply ++;
        domains[maxSupply] = Domain(_name , _cost , false);
    }
    
    // Mint Function -> Its a ERC721 function
    function mint(uint256 _id) public payable{
        
        require((_id != 0));
        require((_id <= maxSupply));
        require(domains[_id].isPurchased == false);
        require(domains[_id].cost <= msg.value);
        
        domains[_id].isPurchased = true;
        totalSupply++;

        _safeMint(msg.sender , _id); // ERC721 function
    }

    // getDomains Function

    function getDomains(uint256 _id) public view returns (Domain memory) {
        return domains[_id];
    }

    // getBalance Function
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Withdraw Function

    function withdraw() public domainOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
