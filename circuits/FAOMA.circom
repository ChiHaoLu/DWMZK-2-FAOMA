pragma circom 2.0.0;

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
    signal output out;

    component mult1 = Multiplier2();
    component mult2 = Multiplier2();
    component mult3 = Multiplier2();

    mult1.in1 <== owner_address;
    mult1.in2 <== mint_time;
    mult2.in1 <== mult1.out;
    mult2.in2 <== token_address;
    mult3.in1 <== mult2.out;
    mult3.in2 <== token_id;
    out <== mult3.out;
}

component main = FAOMA();