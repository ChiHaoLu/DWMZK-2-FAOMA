// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Deployer {
    event Deploy(address indexed deployAddr, address indexed solver, uint indexed problemNum);

    receive() external payable {}

    // bytecode should be abi.encodePacked(creationCode, constructorCode);
    function deploy(bytes memory bytecode, address solver, uint problemNum) 
        external 
        payable 
        returns (address addr) {

        bytes32 _salt = keccak256(abi.encodePacked(block.timestamp, msg.sender));

        assembly {
            addr := create2(
                callvalue(), // wei sent with current call
                // Actual code starts after skipping the first 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Load the size of code contained in the first 32 bytes
                _salt // Salt from function arguments
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        emit Deploy(addr, solver, problemNum);
    }
}