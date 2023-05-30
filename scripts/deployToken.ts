import { ethers } from "hardhat";

async function main() {

  const FAOMATokenFactory = await ethers.getContractFactory("FAOMAToken");
  const FAOMATokenContract = await FAOMATokenFactory.deploy();

  await FAOMATokenContract.deployed();

  console.log(`FAOMATokenContract deployed to ${FAOMATokenContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
