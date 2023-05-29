# Multimedia Security FNP

- See the whole project introduction & info. in the [Report](https://github.com/ChiHaoLu/DWMZK-2-FAOMA/blob/master/report.md).

## Workflow

### Setup

1. Clone the repo
```
$ git clone https://github.com/ChiHaoLu/DWMZK-2-FAOMA.git
$ cd DWMZK-2-FAOMA
```
2. Install Circom from the [official documentation](https://docs.circom.io/getting-started/installation/)
```
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
2. yarn
```
$ yarn
```
3. below operations...

### Contract & Circuit
1. Compile and generate the verifier of the circuit in the `circuits` folder.
```
$ cd circuits
// Compiling the Circuits
$ circom FAOMA.circom --r1cs --wasm --sym --c 
$ cd FAOMA_js
// revise the input.json
// Generating the witness
$ node generate_witness.js FAOMA.wasm input.json witness.wtns

// power of tau - Phase 2
$ snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
$ snarkjs groth16 setup FAOMA.r1cs pot12_final.ptau FAOMA_0000.zkey

// Export the key
$ snarkjs zkey contribute FAOMA_0000.zkey FAOMA_0001.zkey --name="1st Contributor Name" -v
$ snarkjs zkey export verificationkey FAOMA_0001.zkey verification_key.json

// Generating a Proof
$ snarkjs groth16 prove FAOMA_0001.zkey witness.wtns proof.json public.json

// Verify the proof
$ snarkjs groth16 verify verification_key.json public.json proof.json

// Generating Verifier
$ snarkjs zkey export solidityverifier FAOMA_0001.zkey verifier.sol
```
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

