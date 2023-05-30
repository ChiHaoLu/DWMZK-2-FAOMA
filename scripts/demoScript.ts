import { ethers } from "hardhat";
import prompts from "prompts";

async function main() {

  // Wallet Setup
  const accounts = await ethers.getSigners();
  const wallet = accounts[0];
  const receiver = accounts[1];
  console.log("Operator Address: ", wallet.address);
  console.log("Receiver Address: ", receiver.address);

  // Connect FAOMA Token Contract
  const tokenAddress = await promptTokenAddress();
  const FAOMATokenContract = await ethers.getContractAt(
    "FAOMAToken",
    tokenAddress,
    wallet
  );
  console.log(`FAOMATokenContract Address: ${FAOMATokenContract.address}`);

  // Connect Verifier Contract
  const verifierAddress = await promptVerifierAddress();
  const VerifierContract = await ethers.getContractAt(
    "Groth16Verifier",
    verifierAddress,
    wallet
  );
  console.log(`VerifierContract Address: ${VerifierContract.address}`);

  // Mint Token
  const tokenID = 0;
  const tokenURI = "ipfs://";
  console.log(
    `Mint the Token ${tokenID} with tokenURI - "${tokenURI}" to Owner ${wallet.address} `
  );
  await FAOMATokenContract.mint(
    wallet.address,
    tokenID,
    tokenURI as string,
    VerifierContract.address
  );
  const rtnTokenURI = await FAOMATokenContract.tokenURI(tokenID);
  console.log(`Return URI of the  Token ${tokenID}: `, rtnTokenURI);
  const rtnOwnership = await FAOMATokenContract.ownerOf(tokenID);
  console.log(`Return Owner Address of the Token ${tokenID}: `, rtnOwnership);

  // Transfer the ownership
  const calldata = await promptCalldata();
  const calldataArray = JSON.parse(`[${calldata}]`);
  const _pA = calldataArray[0];
  const _pB = calldataArray[1];
  const _pC = calldataArray[2];
  const _pubSignals = calldataArray[3];

  await FAOMATokenContract.transferFrom(
    wallet.address,
    receiver.address,
    tokenID,
    _pA,
    _pB,
    _pC,
    _pubSignals,
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
}

async function promptTokenAddress() {
  const response = await prompts({
    type: "text",
    name: "TokenAddress",
    message: "Please enter the TokenAddress:",
  });
  return response.TokenAddress;
}

async function promptVerifierAddress() {
  const response = await prompts({
    type: "text",
    name: "VerifierAddress",
    message: "Please enter the VerifierAddress:",
  });
  return response.VerifierAddress;
}

async function promptCalldata() {
  const response = await prompts({
    type: "text",
    name: "Calldata",
    message: "Please enter the Calldata of your token transfer verifyProof:",
  });
  return response.Calldata;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
