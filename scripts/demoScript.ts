import { ethers, network } from "hardhat";
import prompts from "prompts";

async function main() {
  // Setup
  const provider = network.provider;
  const accounts = await ethers.getSigners();

  // Deploy FAOMA Token Contract
  const FAOMATokenFactory = await ethers.getContractFactory("FAOMAToken");
  const FAOMATokenContract = await FAOMATokenFactory.deploy();
  await FAOMATokenContract.deployed();
  console.log(`FAOMATokenContract deployed to ${FAOMATokenContract.address}`);

  // Deploy Verifier Contract
  const VerifierFactory = await ethers.getContractFactory("Verifier");
  const VerifierContract = await VerifierFactory.deploy();
  await VerifierContract.deployed();
  console.log(`VerifierContract deployed to ${VerifierContract.address}`);

  // Mint Token


  // Transfer the ownership


}

async function promptTokenURI() {
  const response = await prompts({
    type: "text",
    name: "TokenURI",
    message: "Please enter the TokenURI of your token transfer:",
  });
  return response.TokenURI;
}

async function promptCalldata() {
  const response = await prompts({
    type: "text",
    name: "Calldata",
    message: "Please enter the Calldata of your token transfer verifyProof:",
  });
  return response.Calldata;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
