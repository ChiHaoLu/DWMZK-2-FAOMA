# Title: TBD

**Teammate:** 
- [B08303113 ECON Senior 陸紀豪](https://chihaolu.me)
- B08303110 ECON Senior 陳彥龍

---

## 1. Abstract 

There are many applications for multimedia security and zero-knowledge proofs, such as document verification, privacy-preserving multimedia sharing platforms, digital rights protection, multimedia encryption and decryption tools, and multimedia data privacy protection. The core concepts revolve around privacy, hiding certain or all information while maintaining data availability. The hidden content can include not only audiovisual content and digital artworks but also sensitive data such as consumer credit information, medical records, and even company contracts.

Meanwhile, on the blockchain, due to the characteristic of public transparency, the sender, receiver, and transmitted content are all public. As long as specific financial flows or account owners are known, it is relatively easy in the real world to link the owner relationship of each account and the flow of funds. This is why even with Privacy Solution Mixers like Tornado Cash, intelligence agencies in many countries can still uncover the identity behind the screen. The above description implies that anyone can freely access data transmitted between any two users.

The objective of this project is to utilize zero-knowledge proof technology to add a functionality similar to digital watermarking to on-chain multimedia assets, in order to prove their ownership through layer verification. The chosen blockchain is Ethereum, and the zero-knowledge proof protocol selected is implemented using Circom to achieve ZK-SNARKs (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) Program. It can prove the truth of a statement without revealing the specific content of the statement or providing an interactive proof process.

First, we will delve into introducing the main problem this project aims to solve, which is the lack of ownership proof for analyzing on-chain multimedia assets. We will explore the factors that make it difficult to prove that these on-chain multimedia assets are owned by a particular entity. Next, we will implement a Demo Program to demonstrate the feasibility of our solution. Finally, we will provide a conclusion and discuss the limitations of this project.

---

## 2. The Ownership Vulnerability of On-Chain Multimedia Assets

### 2.1 Virtual Asset

Proving ownership of assets on the blockchain can be challenging due to their virtual nature. Unlike traditional physical assets, such as artworks, which can incorporate tangible and unique features like special paper or pigments to prevent counterfeiting, the proof of ownership for virtual assets requires different approaches.


### 2.2 Easily Copy 

Whether it's a GIF, JPG, or MP3, if the multimedia is on-chain, it means that anyone can easily right-click the object and download it. This issue is not exclusive to the blockchain; it exists for any multimedia content on the internet. However, it becomes more critical on the blockchain because we often consider multimedia on the blockchain as part of valuable assets. If it can be easily copied and used to deceive others in the off-chain world, it can cause significant problems and disruptions.

### 2.3 Not truly decentralized

People frequently upload multimedia files to IPFS, where they are stored as JSON files. Instead of uploading the entire asset onto the blockchain, which would incur a substantial amount of gas fees, IPFS serves as a decentralized and distributed system for storage. However, it's important to note that solely relying on IPFS still leaves the content susceptible to the influence of gateway servers, which can be subject to regulations or even inaccessible in some cases.

### 2.4 Origin of Ownership Problem

The root of the problem lies in the fact that blockchain provides proof of ownership for "on-chain" assets, while images, for instance, do not solely exist on the blockchain. They are typically presented on web pages, allowing anyone to right-click and download them onto their computers. Subsequently, these images can be re-uploaded to the blockchain or falsely claimed off-chain as belonging to someone else (even if they don't). To gain complete control over ownership, we must address this at the layer level. It is necessary to establish a protocol that enables everyone wishing to verify an on-chain multimedia asset, whether on-chain or off-chain, to validate it in a standardized manner.

### 2.5 How to Realize the 2FA for Our Important Asset

In addition to the need for proving ownership at the layer level, there is another critical issue with assets on the blockchain. When our private key is stolen, all the assets in our account can be compromised and stolen as well.

In cryptography and digital ownership, a "signer" is the individual who possesses the private key used for signing transactions or data. On the other hand, the "owner" refers to the person who holds the account or assets associated with that private key.

In off-chain systems like bank accounts, if a user loses their password, alternative methods such as identification or contacting the bank can be used to establish ownership. However, in the on-chain world of blockchain, there is typically no central authority for verifying ownership.

n blockchain networks, transactions and data are cryptographically signed with private keys, and the validity of these signatures confirms ownership and ensures transaction integrity.

Losing a private key in the on-chain world presents challenges in proving ownership. Unlike traditional systems, there is no central authority to reset or recover the password. Ownership solely relies on possessing the private key. This highlights the critical importance of securely managing and safeguarding private keys in blockchain systems.

In our protocol system, we not only aim to establish a genuine verification of ownership for on-chain multimedia assets but also strive to implement a verification system similar to 2FA (2 Factor Authentication). This way, even if our account is compromised, the assets (tokens) within it cannot be transferred unless the 2FA is also breached.

---

## 3. System Design of Solution

### 3.1 Overview

1. 藝術品生產者在圖片上嵌入數位浮水印
4. 使用者在鑄造藝術品時會得到 secret + nullifier，同時這個 token 也會被記入 Merkle Tree 中
6. 使用檢測器掃描圖片之後可以進到協議驗證網站
7. 任何人都可以直接輸入 Token ID 得到該圖像的擁有者地址是誰
8. 擁有者可自行在本地輸入 secret 即可產出 proof
10. 可以使用這個 proof 去觸發 transfer 函式，將其擁有權轉移給新地址

詳細的操作過程會在下一個章節 **Scenario & Demo Result** 講述。

### 3.2 Specification - Digital Watermarking Script

TBD

### 3.3 Specification - Circuit (ZKP Program)

```circom
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
```

### 3.4 Specification - Smart Contract (On-Chain Verifier)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) external view returns (bool r);
}

interface IERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

interface IERC721 is IERC165 {
    function balanceOf(address owner) external view returns (uint balance);

    function ownerOf(uint tokenId) external view returns (address owner);

    function transferFrom(
        address from,
        address to,
        uint id,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals,
        address newVerifierAddr
    ) external;

    function approve(address to, uint tokenId) external;

    function getApproved(uint tokenId) external view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;

    function isApprovedForAll(
        address owner,
        address operator
    ) external view returns (bool);
}

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

abstract contract ERC721 is IERC721 {
    event Transfer(address indexed from, address indexed to, uint indexed id);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint indexed id
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    // Mapping from token ID to owner address
    mapping(uint => address) internal _ownerOf;

    // Mapping owner address to token count
    mapping(address => uint) internal _balanceOf;

    // Mapping from token ID to approved address
    mapping(uint => address) internal _approvals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    // Mapping from token to verifier contract address
    mapping(uint => IVerifier) public verifierOf;

    function supportsInterface(
        bytes4 interfaceId
    ) external pure returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    function ownerOf(uint id) external view returns (address owner) {
        owner = _ownerOf[id];
        require(owner != address(0), "token doesn't exist");
    }

    function balanceOf(address owner) external view returns (uint) {
        require(owner != address(0), "owner = zero address");
        return _balanceOf[owner];
    }

    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function approve(address spender, uint id) external {
        address owner = _ownerOf[id];
        require(
            msg.sender == owner || isApprovedForAll[owner][msg.sender],
            "not authorized"
        );

        _approvals[id] = spender;

        emit Approval(owner, spender, id);
    }

    function getApproved(uint id) external view returns (address) {
        require(_ownerOf[id] != address(0), "token doesn't exist");
        return _approvals[id];
    }

    function _isApprovedOrOwner(
        address owner,
        address spender,
        uint id
    ) internal view returns (bool) {
        return (spender == owner ||
            isApprovedForAll[owner][spender] ||
            spender == _approvals[id]);
    }

    function transferFrom(
        address from,
        address to,
        uint id,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals,
        address newVerifierAddr
    ) public {
        require(from == _ownerOf[id], "from != owner");
        require(to != address(0), "transfer to zero address");
        require(
            to.code.length == 0 ||
                IERC721Receiver(to).onERC721Received(
                    msg.sender,
                    from,
                    id,
                    ""
                ) ==
                IERC721Receiver.onERC721Received.selector,
            "unsafe recipient"
        );

        // 1FA
        require(_isApprovedOrOwner(from, msg.sender, id), "not authorized");

        // 2FA
        require(
            verifierOf[id].verifyProof(_pA, _pB, _pC, _pubSignals),
            "Your proof is not correct"
        );

        _balanceOf[from]--;
        _balanceOf[to]++;
        _ownerOf[id] = to;
        verifierOf[id] = IVerifier(newVerifierAddr);

        delete _approvals[id];

        emit Transfer(from, to, id);
    }

    function _mint(address to, uint id, address verifierAddr) internal {
        require(to != address(0), "mint to zero address");
        require(_ownerOf[id] == address(0), "already minted");

        _balanceOf[to]++;
        _ownerOf[id] = to;
        verifierOf[id] = IVerifier(verifierAddr);

        emit Transfer(address(0), to, id);
    }

    function _burn(uint id) internal {
        address owner = _ownerOf[id];
        require(owner != address(0), "not minted");

        _balanceOf[owner] -= 1;

        delete _ownerOf[id];
        delete _approvals[id];

        emit Transfer(owner, address(0), id);
    }

    function _exists(uint256 id) internal view returns (bool) {
        return _ownerOf[id] != address(0);
    }
}

abstract contract ERC721URIStorage is ERC721 {
    // tokenId => tokenURI
    mapping(uint256 => string) internal _tokenURIs;

    function tokenURI(
        uint256 tokenId
    ) public view virtual returns (string memory) {
        string memory _tokenURI = _tokenURIs[tokenId];

        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(_tokenURI));
        }

        return _tokenURIs[tokenId];
    }

    function _setTokenURI(
        uint256 id,
        string memory _tokenURI
    ) internal virtual {
        require(_exists(id), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[id] = _tokenURI;
    }
}

contract FAOMAToken is ERC721URIStorage {
    function mint(
        address to,
        uint id,
        string memory _tokenURI,
        address verfierAddr
    ) external {
        _mint(to, id, verfierAddr);
        _setTokenURI(id, _tokenURI);
    }

    function burn(uint id) external {
        require(msg.sender == _ownerOf[id], "not owner");
        _burn(id);
    }
}
```

### 3.5 Specification - Website (Client)

TBD

---

## 4. Scenario & Demo Result

### 4.1 Scenario 1: Absolute Ownership

We already know that if the current "provingOwner" of the on-chain multimedia asset wants to prove their ownership, they need to go through the following steps:

1. Their image can be linked to the protocol's website, meaning that the watermark corresponds to the protocol contract.
1. After entering the protocol's website, they can input the Token ID to retrieve the image and owner information.
1. They can visually compare the recorded image (the "image" field in tokenURI) with the image they want to prove, either using the naked eye or an image comparator, to verify if they are the same.
1. They can compare the owner address recorded in the contract for that token with the "provingOwner" address.

Please note that the above steps are required for proving ownership using the protocol.

### 4.2 Scenario 2: Transfer Safty - 2FA

1. The owner needs to generate a "proof" using the "secret" on their local device or on the proof generation website provided by the protocol.
1. Only the owner can call the "transfer" function for their token. This is the first stage of verification.
1. When calling the "transfer" function, the owner must include the "proof" to pass the second stage of verification.
1. If the verification is successful, the token will be transferred to the target owner's address.
1. The owner should securely transfer the "secret" to the target owner through any confidential means, such as messaging applications or in-person exchanges.

```
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
```

---

## 5. Security Consideration & Discussions

### 5.1 It's a Protocol

How do other users know to use a detector on this image to determine the true owner through the use of digital watermarks? This is a protocol, so the suppliers issuing the multimedia assets must comply with this protocol and declare their support for it, and users also need to follow this practice. We need to establish a standard within the community, similar to how we follow the interfaces of ERC-20 and ERC-721.

This raises another question: "What happens if the digital watermark is tampered with or compromised?" Once it has been tampered with or compromised, it will no longer be possible to link it to the protocol contract. If a user encounters a watermark that does not conform to this protocol, they have reasonable grounds to suspect that the current owner is not the true owner of this multimedia asset.

### 5.2 Link to Website not Owner's Name

Why should the digital watermark be directed to the protocol verification website instead of directly indicating who the owner is? Embedding the digital watermark here leads to the protocol verification website rather than directly revealing the owner's identity. This is because the owner can change, and if the digital watermark needs to be updated every time the owner changes, it would not align with our expectations. Although presented in the form of a website, the website itself is just an interface, while the actual data is stored on the contract, eliminating any centralization or security concerns.

The reason for directing the digital watermark to the protocol verification website instead of directly to the token's data website is that it is essential to note that it should not directly lead to the specific token. It must be directed to the globally unique protocol website for querying. If the watermark is tampered with and leads directly to the token, it could be redirected to a fake token data website, deceiving the majority of people.

If the website generating the proof or the protocol verification website (interface) is compromised, does it pose a risk to the users? The answer is yes, but the verification of watermarks, generation of proofs, and interaction with the contract can all be performed on the user's own computer. Generating proofs can be done offline as well. Therefore, if users prioritize security and privacy, they can choose to perform these actions locally without relying on the interface (website) provided by us.

Additionally, if the protocol website is represented only by a "URL" in the watermark, it may not be sufficient to determine the origin of that watermark. In other words, the user experience (UX) may not be optimal. In such cases, we can consider using the Ethereum Name Service (ENS) to assign a human-readable string to the contract address (similar to an on-chain DNS). This way, we can visually determine that the watermark originates from the protocol.

### 5.3 Why choosing Zero Knowledge Proof

Once you enter the protocol verification website, you can directly use signature algorithms like ECDSA or other data comparison techniques to prove ownership. Even by simply using a contract to store the mapping of token IDs and addresses, ownership can be proven, right?

However, the reason for "not simply using" mapping is that using algorithms beyond mapping allows for the decoupling of ownership and signership. This means that we can use the private key of Zero-Knowledge Proofs (ZKP) or the private key of the signature algorithm (which is different from the private key corresponding to the owner's address) as proof of signership, while using the mapping and owner's address as proof of ownership. The benefit of decoupling is achieving a two-factor authentication (2FA) effect, making it more secure. Even if our account is compromised, the assets cannot be transferred.

Furthermore, the reasons for using Zero-Knowledge Proofs (ZKP) are as follows:

1. It prevents replay attacks, as on-chain signatures can be replayed.
2. It is cheaper than signature algorithms in the EVM.
1. It is easily scalable, because we can aggregate lots of things into one proof to lower our cost, but we don't discuss about it in this project.
4. It can achieves privacy in some special design, but we don't discuss about it in this project.

Lastly, as an additional explanation, using the secret alone is sufficient to prove that the user knows the secret. However, we also need a nullifier because information on the blockchain is transparent. To prevent double spending (replay attacks), we require a nullifier similar to a nonce to serve its intended purpose.

---

## 6. Conclusion

There are the following disadvantages to using tokens based on our designed protocol:

1. Before this protocol becomes widely adopted, the effectiveness may not meet expectations. However, if issuers adopt this protocol, those who are aware of the artwork and its distribution method will know how to verify ownership.
1. The process of verifying Zero-Knowledge Proofs (ZKP) is performed within the contract, which will result in significantly higher gas costs for transferring ownership compared to the original ERC-721 contract that did not implement this protocol.
1. The technical threshold for writing contracts will increase.
1. The steps involved in transferring tokens will become more complex.
1. Decoupling ownership and signership will require each token to record a separate secret.

However, if the interface provided by the protocol is used, the thresholds, steps, and operational thresholds for transferring assets can be significantly reduced. At the same time, if wallet providers support the tokens of this protocol, it is also possible to securely manage the secrets of all tokens. This is a relatively ideal scenario, but achieving the expected security of the protocol will require some costs, whether they are technical or transaction fees. However, if the on-chain proof or on-chain artwork is a title deed or a national treasure, perhaps having a few more layers of protection would be better.

In addition, there have been discussions about Zero-Knowledge Proofs (ZKP) in the industry, including multimedia applications. However, most of these discussions focus on blurring, sharpening, or flipping the direction of multimedia content through image processing. This is actually meaningless for artworks because multimedia assets are meant to be appreciated. If the entire content is completely obscured and hidden, it would inevitably lose the meaning of both artistic and practical value.

---

## 7. Reference
- [Circom2 Documentation](https://docs.circom.io/)
- [SnarkJS](https://github.com/iden3/snarkjs)
