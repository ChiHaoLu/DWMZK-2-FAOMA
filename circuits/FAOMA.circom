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

template FAOMA() {
    signal input token_address;
    signal input token_id;
    signal input secret;
    signal output out;

    component hasher1 = Hash();
    component hasher2 = Hash();

    hasher1.a <== token_address;
    hasher1.b <== token_id;
    hasher2.a <== hasher1.hash;
    hasher2.b <== secret;
    out <== hasher2.hash;
}

component main = FAOMA();