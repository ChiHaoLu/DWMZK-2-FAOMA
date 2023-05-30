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

### Contract

1. Deploy the ERC-721 Contract in the `contracts` folder with `deployToken.ts` in the `scripts` folder.
```sh
$ yarn deploy:Token
>
FAOMATokenContract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
✨  Done in 3.56s.
```

### Circuit
1. Compile circuit and generate the verifier of your token circuit in the `circuits` folder. Make sure your `input.json` is correct, and you have downloaded the **Power of Tau** from [here](https://github.com/iden3/snarkjs#guide).
```sh
$ bash ./scripts/build_circuits.sh
>
...
[INFO]  snarkJS: OK!
Generating Verifier Contract
[INFO]  snarkJS: EXPORT VERIFICATION KEY STARTED
[INFO]  snarkJS: > Detected protocol: groth16
[INFO]  snarkJS: EXPORT VERIFICATION KEY FINISHED
Generating verifyProof calldata
["0x0f546fe38ca0aef47eb0de71883ef213dd69d8138268a18c8fa82a7419b6027d", "0x2c72ec1b1bd13a6a316f615544fe8d896b4051f0c61c4285c4dd075e593049dd"],[["0x1d4603fd3bf8e1267da31a500499b9a76c5b1de7de3841cf668b55d3268df275", "0x09c0ef14562ac3a62f2a261ea17f927ddf6b46cffc670e5bca6a87af48a71afd"],["0x2b4c0e56cb2a3ab1fae4ebb8d91deb08e5416792817abdf69aeae16caec4d1af", "0x102690339d0fea73f2affd5eeabe093ef30f01d61ec44ddca29bce26f040e17f"]],["0x0b90f3c442294cf76ace79615cd414290688bbb2c4f7b42360e97be58398df91", "0x2bca0766be34beba92cc7ff07918ba63e12d3925a4fb9ecc3cb095f816d55a10"],["0x0444730cff8dac3879defb6c24c6e0aa50ec55b2bd1aabe444a8e1f189e2ed62"]
```
1. Record the `calldata` above.
1. Deploy the Verifier Contract with `deployVerifier.ts` in the `scripts` folder ,and Record the address.
```sh
$ yarn deploy:Verifier
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
```
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
