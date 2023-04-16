// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const NAME = "DomainDaddy";
  const SYMBOL = "Daddy";
    
  // Deploy Smart Contracts  
  const DomainDaddy = await ethers.getContractFactory("DomainDaddy");
  const domainDaddy = await DomainDaddy.deploy(NAME, SYMBOL);
  await domainDaddy.deployed();

  console.log("Deployed Domain Contracts at " + domainDaddy.address + "\n");

  // List 6 domains
  const names = ["sarah.eth", "sona.eth", "raya.eth", "rakesh.eth", "ox.eth", "klopp.eth", "salah.eth", "bobby.eth", "naby.eth", "jota.eth"];
  const costs = [tokens(0.00001), tokens(0.00002), tokens(0.00003), tokens(0.00004), tokens(0.00005), tokens(1), tokens(7), tokens(9), tokens(10), tokens(12)]

  for (var i = 0; i < 10; i++) {
    const transaction = await domainDaddy.connect(deployer).list(names[i], costs[i])
    await transaction.wait()

    console.log("Listed Domain " + (i + 1) + "  :  " + names[i])

}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
