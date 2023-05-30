# Multimedia Security FNP

## About FNP
> Submit the final report `.zip` before 6/5 23:59. 

See the whole project introduction & info. in the [Report](https://github.com/ChiHaoLu/DWMZK-2-FAOMA/blob/master/report) folder.
- [Report](): `.pdf`, realize/investigate a security related final project proposed by the group members
- [Oral Presentation](): `.mp4`, with 30mins vocal explanation recorded slide-by-slide
- [Presentation Slides](): `.ppt`

## Workflow
### Setup

1. Clone the repo
```sh
$ git clone https://github.com/ChiHaoLu/DWMZK-2-FAOMA.git
$ cd DWMZK-2-FAOMA
```
2. Install Circom from the [official documentation](https://docs.circom.io/getting-started/installation/)
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
2. Install the dependencies with yarn
```sh
$ yarn
```
3. Continure with below operations

### Contract

1. Compile the contract in the `contracts` folder.
```sh
$ yarn compile
```
1. Deploy the ERC-721 Contract in the `contracts` folder with `deployToken.ts` in the `scripts` folder.
```sh
$ yarn execute scripts/deployToken.ts
```

### Circuit
1. Compile and generate the verifier of your token circuit in the `circuits` folder.
```sh
$ bash ./scripts/build_circuits.sh
```
1. Deploy the Verifier Contract with `deployVerifier.ts` in the `scripts` folder ,and Record the address.
```sh
$ yarn execute scripts/deployVerifier.ts
```

### Generating Image with watermark
1. Put the target image in the `images` folder.
1. Use the watermarking script in the `scripts` folder to watermark the target image.
```sh
$ yarn execute scripts/
```

### Operations in the protocol website
1. Start the protocol website in the `client`.
```sh
$ yarn start
```
1. Mint the target NFT (input your image tokenURI, verifier address)
1. Check the ownership 
1. Generate the proof of ownership 
1. Transfer the ownership

## Reference

- [SnarkJS](https://github.com/iden3/snarkjs)
