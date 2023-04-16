const { expect } = require("chai");
//Mocha baked in hardhat
const { ethers } = require("hardhat");

const tokens = (n) => {
  //Convert tokens to ether
  return ethers.utils.parseUnits(n.toString(), "ether");
}

describe("DomainDaddy", ()  => {

  let domainDaddy, result , domain;
  let deployer;
  
  // owner1 mints NFT
  let owner1; 

  const NAME = "DomainDaddy";
  const SYMBOL = "Daddy";
  
  beforeEach(async ()=>{

    // Setup Accounts
    [deployer , owner1] = await ethers.getSigners();
    
    // Deploy Contracts
    const DomainDaddy = await ethers.getContractFactory("DomainDaddy");
    domainDaddy = await DomainDaddy.deploy(NAME, SYMBOL);

    // List a domain 
    const transaction = await domainDaddy.connect(deployer).list("rakesh.eth", tokens(10));
    await transaction.wait();
  })
// ==========================Deployment==========================
  describe ("Deployment" , () =>{
    it("Has a name" , async () =>{

      result = await domainDaddy.name();
      expect(result).to.equal(NAME);    
    });
  
    it("Has a symbol" , async () =>{
  
      result = await domainDaddy.symbol();
      expect(result).to.equal(SYMBOL);
      
    });

    it("Sets the owner" , async () =>{
  
      result = await domainDaddy.owner();
      expect(result).to.equal(deployer.address);
      
    });

    it("Returns the max supply", async () => {
      const result = await domainDaddy.maxSupply();
      expect(result).to.equal(1);
    });

    it("Returns the total supply", async () => {
      const result = await domainDaddy.totalSupply();
      expect(result).to.equal(0);
    });

  })
// ==========================Deployment End==========================

// ==========================Domain Start==========================
  describe("Domain" , () =>{
    
    it("Returns domain atributes" , async () =>{
      domain = await domainDaddy.getDomains(1);
      
      expect(domain.name).to.be.equal("rakesh.eth");    

      expect(domain.cost).to.be.equal(tokens(10));    
      
      expect(domain.isPurchased).to.be.equal(false);    
    })
  })
// ==========================Domain End==========================


// ==========================Mint NFT Start==========================
  describe("Minting" , () =>{

    const ID = 0.00001;
    const AMOUNT = ethers.utils.parseUnits("10", 'ether');


    beforeEach(async () => {
      
      // owner1 mints NFT
      const transaction = await domainDaddy.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it('Updates the owner', async () => {
      const owner = await domainDaddy.ownerOf(ID)
      expect(owner).to.be.equal(owner1.address)
    })

    it('Updates the domain status', async () => {
      const domain = await domainDaddy.getDomains(ID)
      expect(domain.isPurchased).to.be.equal(true)
    })

    it('Updates the contract balance', async () => {
      const result = await domainDaddy.getBalance()
      expect(result).to.be.equal(AMOUNT)
    })
    
  })
// ==========================Mint NFT END==========================

// ==========================Withdraw Start==========================
  describe("Withdrawing", () => {
    const ID = 0.00001;
    const AMOUNT = ethers.utils.parseUnits("10", 'ether');
    let balanceBefore;

    beforeEach(async () => {
      // Get before Balance from deployer address
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // Mint NFT
      let transaction = await domainDaddy.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait();

      //Connect to deployer account and call withdraw function
      transaction = await domainDaddy.connect(deployer).withdraw();
      await transaction.wait();
    });

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it('Updates the contract balance', async () => {
      result = await domainDaddy.getBalance();
      expect(result).to.equal(0);
    });

  })

// ==========================Withdraw END==========================
})