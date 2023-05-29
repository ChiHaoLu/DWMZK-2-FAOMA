# Multimedia Security FNP

- See the whole project introduction & info. in the [Report](https://github.com/ChiHaoLu/DWMZK-2-FAOMA/blob/master/report.md).

## Workflow

### Setup

1. Clone the repo
2. install circom
2. yarn
3. below operations...

### Contract & Circuit
1. Compile and generate the verifier of the circuit in the `circuits` folder.
1. Deploy the ERC-721 Contract in the `contracts` folder with `deploy.ts` in the `tasks` folder, which inherited the verifier contract.

### Image
1. Put the target image in the `images` folder.
1. Use the watermarking script in the `scripts` folder to watermark the target image.
1. Start the protocol website in the `client`.

### Operations in the protocol website
1. Mint the target NFT (and input your image tokenURI)
1. Check the ownership 
1. Generate the proof of ownership 
1. Transfer the ownership

