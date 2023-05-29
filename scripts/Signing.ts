import { ethers } from "hardhat"

async function main() {

    // Prepare the provider & wallet(signer)
    const provider = ethers.provider
    const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY as any, provider)

    // The data to sign
    const problemSolverAddr = '0xDEcf23CbB14972F2e9f91Ce30515ee955a124Cba'
    const problemNumber = '997'
    const problemSolvedTimestamp = 1673070083
    const approverKeyAddr = process.env.DEV_KEY_1_ADDR as string
    const approverIndex = 3

    console.log(
        `Signer Key Address: ${wallet.address}`,
    )
    console.log(`    - Problem Solver Address  : ${problemSolverAddr}`)
    console.log(`    - Problem Number is       : ${problemNumber}`)
    console.log(`    - Problem Solved Timestamp: ${problemSolvedTimestamp}`)
    console.log(`    - Signature Approver Key  : ${approverKeyAddr}`)
    console.log(`    - Signature Approver Index: ${approverIndex}`)

    // Sign the Msg
    const encode = ethers.utils.solidityPack(
        ["address", "uint256", "uint256", "address", "uint8"],
        [problemSolverAddr, problemNumber, problemSolvedTimestamp, approverKeyAddr, approverIndex]
    )
    const msgHash = ethers.utils.keccak256(encode)

    const messageHash = ethers.utils.solidityKeccak256(["address", "uint256", "uint256", "address", "uint8"],
        [problemSolverAddr, problemNumber, problemSolvedTimestamp, approverKeyAddr, approverIndex])
    const signingHash = ethers.utils.solidityKeccak256(["string", "bytes32"], ["\x19Ethereum Signed Message:\n32", messageHash])
    const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash))
    const verified = ethers.utils.verifyMessage(ethers.utils.arrayify(messageHash), signature)

    console.log(`\ngetMessageHash: ${msgHash}`)
    console.log(`getEthSignedMessageHash: ${signingHash}`)
    console.log(`Signature: ${signature}`)

    console.log(`\nrecoverSigner(${signingHash},${signature})`)
    console.log(`\nVerifySignature(${problemSolverAddr},${problemNumber},${problemSolvedTimestamp},${approverKeyAddr},${signature})`)

    // Check the Signature is Valid
    // console.log(verified.toLowerCase())
    // console.log(approverKeyAddr.toLowerCase())

    const valid = verified.toLowerCase() == approverKeyAddr.toLowerCase();
    console.log(`\nCheck the Signature is...${valid ? "Approved!" : "Invalid!"}`)
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })