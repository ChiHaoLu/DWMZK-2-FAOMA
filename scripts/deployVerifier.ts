import { task, types } from "hardhat/config";

task("deploy", "Deploy a Verifier contract")
  .addOptionalParam(
    "Verifier",
    "Verifier Contract address",
    undefined,
    types.string
  )
  .setAction(async ({ Verifier: VerifierAddress }, { ethers, run }) => {
    if (!VerifierAddress) {
      const { address } = await run("deploy:Verifier", {});

      VerifierAddress = address;
    }

    const VerifierFactory = await ethers.getContractFactory("Verifier");

    const VerifierContract = await VerifierFactory.deploy(
      VerifierAddress
    );

    await VerifierContract.deployed();

    console.info(
      `Verifier contract has been deployed to: ${VerifierContract.address}`
    );

    return VerifierContract;
  });
