import { ethers } from "hardhat";

async function main() {
  const VerifierFactory = await ethers.getContractFactory("Verifier");
  const VerifierContract = await VerifierFactory.deploy();

  await VerifierContract.deployed();

  console.log(`VerifierContract deployed to ${VerifierContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
