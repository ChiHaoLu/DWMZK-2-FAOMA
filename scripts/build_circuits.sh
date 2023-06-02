#!/bin/bash

# constants
TARGET_CIRCUIT=FAOMA.circom

# begin script
cd "$(dirname "$0")"

# to circuits folder
cd ../circuits

# generate FAOMA.r1cs & FAOMA.sym & FAOMA.wasm
echo 'Generating FAOMA.r1cs & FAOMA.sym & FAOMA.wasm'
circom $TARGET_CIRCUIT --r1cs --wasm --sym

# Generating the witness
echo 'Generating the Witness'
node ./FAOMA_js/generate_witness.js ./FAOMA_js/FAOMA.wasm input.json witness.wtns

# Power of Tau
echo 'Power of Tau'
snarkjs groth16 setup FAOMA.r1cs powersOfTau28_hez_final_14.ptau FAOMA_0000.zkey

# Export the key
echo "Generating the Key"
snarkjs zkey contribute FAOMA_0000.zkey FAOMA_0001.zkey --name="1st contribution Name" -v -e="Another random entropy for 1st contribution"
snarkjs zkey contribute FAOMA_0001.zkey FAOMA_0002.zkey --name="Second contribution Name" -v -e="Another random entropy for 2nd contribution"
snarkjs zkey export verificationkey FAOMA_0002.zkey verification_key.json

# Generating a Proof
echo "Generating Proof"
snarkjs groth16 prove FAOMA_0002.zkey witness.wtns proof.json public.json

# Verify the proof
echo "Verify the proof"
snarkjs groth16 verify verification_key.json public.json proof.json

# # Generating Verifier
echo "Generating Verifier Contract"
snarkjs zkey export solidityverifier FAOMA_0002.zkey ../contracts/Verifier.sol

# # Generating calldata
echo "Generating verifyProof calldata"
snarkjs generatecall
