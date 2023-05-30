import { ethers } from "hardhat";

async function main() {

  const FAOMATokenFactory = await ethers.getContractFactory("FAOMAToken");
  const FAOMATokenContract = await FAOMATokenFactory.deploy();

  await FAOMATokenContract.deployed();

  console.log(`FAOMATokenContract deployed to ${FAOMATokenContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
