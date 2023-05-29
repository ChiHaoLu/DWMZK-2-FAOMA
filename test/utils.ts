import { ethers } from "hardhat";

const getSignature = async (
    signer: any,
    problemSolverAddr: string,
    problemNumber: number,
    problemSolvedTimestamp: number,
    approverKeyAddr: string,
    approverIndex: number
) => {
    // Sign the Msg
    const messageHash = ethers.utils.solidityKeccak256(["address", "uint256", "uint256", "address", "uint8"],
        [problemSolverAddr, problemNumber, problemSolvedTimestamp, approverKeyAddr, approverIndex])
    const signature = await signer.signMessage(ethers.utils.arrayify(messageHash));

    return signature;
}

const getApproverIndex = (address: string) => {
    if (address === process.env.SERVER_KEY_ADDR as string) return 0;
    else if (address === process.env.CHEF_KEY_ADDR as string) return 1;
    else if (address === process.env.LAB_KEY_ADDR as string) return 2;
    else if (address === process.env.DEV_KEY_1_ADDR as string) return 3;
    else if (address === process.env.DEV_KEY_2_ADDR as string) return 4;
    else return (-1);
}

const getMsgHash = (
    problemSolverAddr: string, 
    problemNumber: number, 
    problemSolvedTimestamp: number, 
    approverKeyAddr: string, 
    approverIndex: number
) => {
    const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "address", "uint8"],
        [problemSolverAddr, problemNumber, problemSolvedTimestamp, approverKeyAddr, approverIndex]
    );
    return messageHash;
}

const getEthMsgHash = (
    problemSolverAddr: string, 
    problemNumber: number, 
    problemSolvedTimestamp: number, 
    approverKeyAddr: string, 
    approverIndex: number
) => {
    const messageHash = getMsgHash(
        problemSolverAddr, 
        problemNumber, 
        problemSolvedTimestamp, 
        approverKeyAddr, 
        approverIndex
    );
    const signingHash = ethers.utils.solidityKeccak256(["string", "bytes32"], ["\x19Ethereum Signed Message:\n32", messageHash]);
    return signingHash;
}

const deploy = async () => {
    let provider: any;

    provider = ethers.provider;
    const RewardContract = await ethers.getContractFactory("Reward");
    //deploy the contract
    const rewardContract = await RewardContract.deploy();
    await rewardContract.deployed();

    const approver = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY as any, provider); // signer in backend

    const signers = await ethers.getSigners();
    const deployerAddr = signers[0].address; // deployer
    const ownerAddr = signers[1].address // an owner that will be added in the owners group
    const receiverAddr = signers[2].address;
    const nobodyAddr = signers[3].address;
    const operatorAddr = signers[4].address;
    const solver1Addr = signers[5].address; // solver
    const solver2Addr = signers[6].address;
    const solver3Addr = signers[7].address;
    const solver4Addr = signers[8].address;

    const deployerContract = rewardContract.connect(signers[0]);
    const ownerContract = rewardContract.connect(signers[1]);
    const receiverContract = rewardContract.connect(signers[2]);
    const nobodyContract = rewardContract.connect(signers[3]);
    const operatorContract = rewardContract.connect(signers[4]);
    const solver1Contract = rewardContract.connect(signers[5]);
    const solver2Contract = rewardContract.connect(signers[6]);
    const solver3Contract = rewardContract.connect(signers[7]);
    const solver4Contract = rewardContract.connect(signers[8]);
    
    return [
        provider, approver, rewardContract,
        deployerAddr, ownerAddr, receiverAddr, nobodyAddr, operatorAddr, solver1Addr, solver2Addr, solver3Addr, solver4Addr,
        deployerContract, ownerContract, receiverContract, nobodyContract, operatorContract,
        solver1Contract, solver2Contract, solver3Contract, solver4Contract
    ];
}

const getCurrentTimestamp = async (provider: any) => {
    const currentBlockNum = await provider.getBlockNumber();
    const block = await provider.getBlock(currentBlockNum);
    return block.timestamp;
}

const getRandomProblemNum = () => {
  const min = Math.ceil(1);
  const max = Math.floor(100);
  let result: number = 10;
  while (result == 10) result = Math.floor(Math.random() * (max - min) + min);
  return result;
}

const generateMintingDataForOneProblem = async(
    provider: any,
    signer: any,
    problemSolverAddr: string,
    approverKeyAddr: string,
) => {
    const problemSolvedTimestamp = await getCurrentTimestamp(provider);
    const approverIndex = getApproverIndex(approverKeyAddr);
    const problemNumber = 10;
    const signature = await getSignature(
        signer,
        problemSolverAddr,
        problemNumber,
        problemSolvedTimestamp,
        approverKeyAddr,
        approverIndex);
    return {
        problemSolverAddr, 
        problemNumber, 
        problemSolvedTimestamp, 
        approverKeyAddr, 
        approverIndex, 
        signature
    };
}

const generateMintingDataForMultipleProblems = async(
    provider: any,
    signer: any,
    problemSolverAddr: string,
    approverKeyAddr: string,
) => {
    const problemSolvedTimestamp = await getCurrentTimestamp(provider);
    const approverIndex = getApproverIndex(approverKeyAddr);
    const problemNumber = getRandomProblemNum();
    const signature = await getSignature(
        signer,
        problemSolverAddr,
        problemNumber,
        problemSolvedTimestamp,
        approverKeyAddr,
        approverIndex
        );
    
    return {
        problemSolverAddr, 
        problemNumber, 
        problemSolvedTimestamp, 
        approverKeyAddr, 
        approverIndex, 
        signature
    };
}

const generateTokenUri = (id: number) => {
    return `ipfs://<IPFS_prefix>/${id}.json`
}


export default{ 
    getSignature, 
    getMsgHash, 
    getEthMsgHash,
    getCurrentTimestamp, 
    getApproverIndex, 
    deploy,
    generateMintingDataForOneProblem,
    generateMintingDataForMultipleProblems,
    generateTokenUri,
}