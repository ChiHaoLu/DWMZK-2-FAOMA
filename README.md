# Multimedia Security FNP

## About FNP
> Submit the final report `.zip` before 6/5 23:59. 

See the whole project introduction & info. in the [Report](https://github.com/ChiHaoLu/DWMZK-2-FAOMA/blob/master/report) folder.
- [Report](): `.pdf`, realize/investigate a security related final project proposed by the group members
- [Oral Presentation](): `.mp4` in the google drive, with 30mins vocal explanation recorded slide-by-slide
- [Presentation Slides](): `.ppt`

## Workflow
### 1. Setup

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
3. Start the local devnet in the new terminal / command line.
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

### 2. Contract

1. Deploy the ERC-721 Contract in the `contracts` folder with `deployToken.ts` in the `scripts` folder.
```sh
$ yarn deploy:Token
>
FAOMATokenContract deployed to 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
✨  Done in 3.00s.
```

### 3. Circuit
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
["0x0382776eb1357de8db42e3934e8096627597ab787af67f36c6619cd87dd1fefe", "0x1cf7753f14f2ff96357de2cd02293f4730f931be864575b237cf8ce25498e752"],[["0x1994485e6678734190bf3f173b3113da83404440c506a2564577532ec3c96dc9", "0x2914e04374fb0d8edd441f2b5965aa9b61747ad806ceba131b8b6a9a611a1784"],["0x2a838da22c5a3e359a8be7937abca7be716343f65c1e03c380adbd6e847e84cf", "0x0b99e4dbf0c0230ac672e33ec63a26eca2e5851f68d7ae34211ac6bae5bd197e"]],["0x068f5af5c3e7ea59acc6414e4fbe3a4f7d9aaa966848fcfdae93d6923b3aef01", "0x2449799406b0955ecab548fdc34d4001aa0b6dc8c3850962c3478bdc8f598a9a"],["0x12f60538e3f1ea532c768145dd585b68c37814b296c49377df123ec80be9a0ab"]
```
1. Deploy the Verifier Contract with `deployVerifier.ts` in the `scripts` folder ,and Record the address.
```sh
$ yarn deploy:Verifier
>
VerifierContract deployed to 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
✨  Done in 2.60s.
```

### 4. Generating Image with watermark
> TBD
1. Put the target image in the `images` folder.
1. Use the watermarking script in the `scripts` folder to watermark the target image.
```sh
$ yarn execute scripts/
```

### 5. Operations in the Demo Script 
1. Prepare the `FAOMAToken Address`, `Verifier Address`, `TokenURI`, `verifyProof calldata`.
2. Run the `demoScript.ts` in the local devnet.
```sh
$ yarn demo
>
$ node -r ts-node/register -r tsconfig-paths/register hardhatRunWithArgs.ts scripts/demoScript.ts --network localhost
Operator Address:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Receiver Address:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
✔ Please enter the TokenAddress: … 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
FAOMATokenContract Address: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
✔ Please enter the VerifierAddress: … 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
VerifierContract Address: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318

Mint the Token 0 with tokenURI - "ipfs://" to Owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 
Return URI of the  Token 0:  ipfs://
Return Owner Address of the Token 0:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Return Verifier Address of the Token 0:  0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
✔ Please enter the Calldata of your token transfer verifyProof: … ["0x0382776eb1357de8db42e3934e8096627597ab787af67f36c6619cd87dd1fefe", "0x1cf7753f14f2ff96357de2cd02293f4730f931be864575b237cf8ce25498e752"],[["0x1994485e6678734190bf3f173b3113da83404440c506a2564577532ec3c96dc9", "0x2914e04374fb0d8edd441f2b5965aa9b61747ad806ceba131b8b6a9a611a1784"],["0x2a838da22c5a3e359a8be7937abca7be716343f65c1e03c380adbd6e847e84cf", "0x0b99e4dbf0c0230ac672e33ec63a26eca2e5851f68d7ae34211ac6bae5bd197e"]],["0x068f5af5c3e7ea59acc6414e4fbe3a4f7d9aaa966848fcfdae93d6923b3aef01", "0x2449799406b0955ecab548fdc34d4001aa0b6dc8c3850962c3478bdc8f598a9a"],["0x12f60538e3f1ea532c768145dd585b68c37814b296c49377df123ec80be9a0ab"]

Transfer the Token 0 
   - from Owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 
   - to Receiver 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 
   - with new verifier contract address 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   - and proof:
[
  [
    '0x0382776eb1357de8db42e3934e8096627597ab787af67f36c6619cd87dd1fefe',
    '0x1cf7753f14f2ff96357de2cd02293f4730f931be864575b237cf8ce25498e752'
  ],
  [
    [
      '0x1994485e6678734190bf3f173b3113da83404440c506a2564577532ec3c96dc9',
      '0x2914e04374fb0d8edd441f2b5965aa9b61747ad806ceba131b8b6a9a611a1784'
    ],
    [
      '0x2a838da22c5a3e359a8be7937abca7be716343f65c1e03c380adbd6e847e84cf',
      '0x0b99e4dbf0c0230ac672e33ec63a26eca2e5851f68d7ae34211ac6bae5bd197e'
    ]
  ],
  [
    '0x068f5af5c3e7ea59acc6414e4fbe3a4f7d9aaa966848fcfdae93d6923b3aef01',
    '0x2449799406b0955ecab548fdc34d4001aa0b6dc8c3850962c3478bdc8f598a9a'
  ],
  [
    '0x12f60538e3f1ea532c768145dd585b68c37814b296c49377df123ec80be9a0ab'
  ]
]
Return Owner Address of the Token 0:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Return Verifier Address of the Token 0:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
✨  Done in 18.48s.
```

### 6. Operations in the protocol website
> TBD
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
