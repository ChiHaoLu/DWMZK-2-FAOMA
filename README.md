# Multimedia Security FNP

## About FNP
> Submit the final report `.zip` before 6/5 23:59. 

See the whole project introduction & info. in the [Report](https://github.com/ChiHaoLu/DWMZK-2-FAOMA/blob/master/report) folder.
- [Report](): `.pdf`, realize/investigate a security related final project proposed by the group members
- [Oral Presentation](): `.mp4` in the google drive, with 30mins vocal explanation recorded slide-by-slide
- [Presentation Slides](): `.ppt`

## Workflow
### Setup

1. Clone the repo.
```sh
$ git clone https://github.com/ChiHaoLu/DWMZK-2-FAOMA.git
$ cd DWMZK-2-FAOMA
```
2. Install Circom from the [official documentation](https://docs.circom.io/getting-started/installation/).
```sh
// Installing dependencies in Linux or MacOS
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

// Installing circom
$ git clone https://github.com/iden3/circom.git
$ cd circom
$ cargo build --release
$ cargo install --path circom
$ circom --help

   Circom Compiler 2.0.0
   IDEN3
   Compiler for the Circom programming language

   USAGE:
      circom [FLAGS] [OPTIONS] [input]

   FLAGS:
      -h, --help       Prints help information
         --inspect    Does an additional check over the constraints produced
         --O0         No simplification is applied
      -c, --c          Compiles the circuit to c
         --json       outputs the constraints in json format
         --r1cs       outputs the constraints in r1cs format
         --sym        outputs witness in sym format
         --wasm       Compiles the circuit to wasm
         --wat        Compiles the circuit to wat
         --O1         Only applies var to var and var to constant simplification
      -V, --version    Prints version information

   OPTIONS:
         --O2 <full_simplification>    Full constraint simplification [default: full]
      -o, --output <output>             Path to the directory where the output will be written [default: .]

   ARGS:
      <input>    Path to a circuit with a main component [default: ./circuit.circom]

// Installing snarkjs
$ npm install -g snarkjs
```
2. Install the dependencies with `yarn`.
```sh
$ yarn
```
3. Start the local devnet.
```sh
$ yarn start:localNode
```
3. Continue the below operations.

> If you get the error `Error: listen EADDRINUSE: address already in use 127.0.0.1:8545`, try to kill the `PID` which occupy your port. 
> ```sh
> $ lsof -i tcp:8545
> >
> COMMAND   PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
> node    16783 chihaolu   23u  IPv4 0xe7a59731a25a2ba1      0t0  TCP localhost:8545 (LISTEN)
> $ kill -9 16783
> ```

### Contract

1. Deploy the ERC-721 Contract in the `contracts` folder with `deployToken.ts` in the `scripts` folder.
```sh
$ yarn deploy:Token
>
FAOMATokenContract deployed to 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
✨  Done in 3.00s.
```

### Circuit
1. Compile circuit and generate the verifier of your token circuit in the `circuits` folder. 
   - Make sure your `input.json` is correct(especially `token_address` is the contract address you have deployed above), 
   - and you have downloaded the **Power of Tau** from [here](https://github.com/iden3/snarkjs#guide).
```sh
$ bash ./scripts/build_circuits.sh
>
...
Verify the proof
[INFO]  snarkJS: OK!
Generating Verifier Contract
[INFO]  snarkJS: EXPORT VERIFICATION KEY STARTED
[INFO]  snarkJS: > Detected protocol: groth16
[INFO]  snarkJS: EXPORT VERIFICATION KEY FINISHED
Generating verifyProof calldata
["0x214a29fa5420abd96b9384a2a96a83b0e906b7d0d666a103ebb22bbdb18715db", "0x2e0aec8b93f48f44ba426b46bce4222d2266191ef5450167915406872da9492f"],[["0x06e1eb47d6eb96b074ab452eb48fbbc06141838205dafd94c27ad0574f311c25", "0x2d2bf57deebd1a7ddf984da3d1915ff6a4867675602a325f5ac21cc4d0f670ce"],["0x153159babab02438395e5e91ac1cb4a6687a50e8f00bea21e26692f6925a64af", "0x1e6d3a371679afa67683cb5306ad46992e249473a0658f734272f15daa378d7d"]],["0x0389900f8cc14dd10bb6543d5fd7b08faae588fe33e259fd98ec37b1091c1622", "0x2f3ef367a4ec5035c6d0fb5df8e629ad36c6224d22603924c1dffb0095167863"],["0x1dafb491ddc564ff3a00f7b91062fab2ed332f8e35ba7c9c34aedb1b7f1f06c1"]
```
1. Deploy the Verifier Contract with `deployVerifier.ts` in the `scripts` folder ,and Record the address.
```sh
$ yarn deploy:Verifier
>
VerifierContract deployed to 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
✨  Done in 2.60s.
```

### Generating Image with watermark
1. Put the target image in the `images` folder.
1. Use the watermarking script in the `scripts` folder to watermark the target image.
```sh
$ yarn execute scripts/
```

### Operations in the Demo Script 
1. Prepare the `FAOMAToken Address`, `Verifier Address`, `TokenURI`, `verifyProof calldata`.
2. Run the `demoScript.ts` in the local devnet.
```sh
$ yarn demo
```

### Operations in the protocol website
1. Start the protocol website in the `client`.
```sh
$ yarn start
```
1. Mint the target NFT (input your image tokenURI, verifier address)
1. Scan your Image and link to the website, then you can check the ownership 
1. Generate the proof of ownership (input your verifyProof calldata)
1. Transfer the ownership

## Reference

- [SnarkJS](https://github.com/iden3/snarkjs)
