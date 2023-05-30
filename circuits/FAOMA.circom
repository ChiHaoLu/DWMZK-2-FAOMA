pragma circom 2.0.0;

include "./mimcsponge.circom";

template Hash() {
    signal input a;
    signal input b;
    signal output hash;

    component hasher = MiMCSponge(2, 220, 1);
    hasher.ins[0] <== a;
    hasher.ins[1] <== b;
    hasher.k <== 0;

    hash <== hasher.outs[0];
}

template Multiplier2(){
   //Declaration of signals.
   signal input in1;
   signal input in2;
   signal output out;

   //Statements.
   out <== in1 * in2;
}

template FAOMA() {
    signal input owner_address;
    signal input mint_time;
    signal input token_address;
    signal input token_id;
    signal input secret;
    signal output out;

    component mult = Multiplier2();
    component hasher;

    mult.in1 <== owner_address - mint_time;
    mult.in2 <== token_address;
    hasher.a <== mult.out - token_id;
    hasher.b <== secret;
    out <== hasher.hash;
}

component main = FAOMA();