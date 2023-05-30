import { ethers } from "hardhat";

async function main() {
  const VerifierFactory = await ethers.getContractFactory("Groth16Verifier");
  const VerifierContract = await VerifierFactory.deploy();

  await VerifierContract.deployed();

  console.log(`VerifierContract deployed to ${VerifierContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
