import { task, types } from "hardhat/config"

task("deploy", "Deploy a FAOMAToken contract")
  .addOptionalParam(
    "FAOMAToken",
    "FAOMAToken Contract address",
    undefined,
    types.string
  )
  .setAction(async ({ FAOMAToken: FAOMATokenAddress }, { ethers, run }) => {
    if (!FAOMATokenAddress) {
      const { address } = await run("deploy:FAOMAToken", {});

      FAOMATokenAddress = address;
    }

    const FAOMATokenFactory = await ethers.getContractFactory("FAOMAToken");

    const FAOMATokenContract = await FAOMATokenFactory.deploy(
      FAOMATokenAddress
    );

    await FAOMATokenContract.deployed();

    console.info(
      `FAOMAToken contract has been deployed to: ${FAOMATokenContract.address}`
    );

    return FAOMATokenContract;
  });
