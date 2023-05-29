// SPDX-License-Identifier: Apache License
pragma solidity ^0.8.17;

contract ConsumeMsg {
   address[] signingKey = [
        0x0b88cd9c5B6B73145332316C199a5B3a52415730,
        0xdCca4cE55773359E191110Eeb21E0413f770032B,
        0x189C92f28047c979cA2D17C13e3A12963EB1b8B4,
        0xd8538ea74825080c0c80B9B175f57e91Ff885Cb4,
        0xf8601B6E1f265De57a691Ff64Ddc5e5f2cad17Ac
    ];

    function getMessageHash(
        address _solver,
        uint256 _problemNumber,
        uint256 _timestamp,
        address _approverKeyAddr,
        uint8 _approverIndex
    ) public pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                _solver, 
                _problemNumber, 
                _timestamp, 
                _approverKeyAddr,
                _approverIndex
        ));
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function VerifySignature(
        address _solver,
        uint256 _problemNumber,
        uint256 _timestamp,
        address _approverKeyAddr,
        uint8 _approverIndex,
        bytes memory _signature
    ) public view returns (bool) {
        bytes32 messageHash = getMessageHash(_solver, _problemNumber, _timestamp, _approverKeyAddr, _approverIndex);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return (recoverSigner(ethSignedMessageHash, _signature) == signingKey[_approverIndex]);
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory _sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(_sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(_sig, 32))
            // second 32 bytes
            s := mload(add(_sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(_sig, 96)))
        }

        // implicitly return (r, s, v)
    }
}
