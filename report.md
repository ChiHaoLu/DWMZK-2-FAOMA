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
8. 擁有者在協議網站輸入 secret + nullifier 即可產出 proof，也就是證明 private 變數：secret, nullifier, pathElements, pathIndices 可以計算出 public 變數：root 與 nullifierHash
10. 可以使用這個 proof 去觸發 transfer 函式，將其擁有權轉移給新地址

詳細的操作過程會在下一個章節 **Scenario & Demo Result** 講述。

### 3.2 Specification - Digital Watermarking Script

TBD

### 3.3 Specification - Circuit

TBD

### 3.4 Specification - Smart Contract

TBD

### 3.5 Specification - Website

TBD

---

## 4. Scenario & Demo Result

### 4.1 Scenario 1: Absolute Ownership

我們已經知道如果當前「宣告自己擁有此鏈上多媒體資產的人（`provingOwner`）」要證明其為擁有者，他需要通過以下所有內容：
1. 他的圖片可以連結到協議網站，換句話說是此浮水印可以對應出協議合約
2. 進入協議網站之後可以藉由輸入 Token ID 得到圖片、擁有者
3. 可用肉眼或圖片比較器，查看此紀錄圖片（tokenURI 中的 `image` field）與該被證明圖片是否為同一張
4. 可比較合約中紀錄該 token 的 owner address 是否為 `provingOwner`

### 4.2 Scenario 2: Transfer Safty - 2FA

1. Owner 需要在本地端或者協議提供的 `proof` 生產網站，利用 `secret` 和 `nullerfier` 產出的 `proof`
2. 只有 Owner 才可以呼叫自己 token 的 `transfer` 函式，這是第一階段驗證
3. 呼叫 `transfer` 函式時，還必須附上 `proof`，才能通過第二階段驗證
4. 成功轉移給目標擁有者的地址
5. 利用任何不公開途徑（例如訊息軟體、面對面）將 `secret` 交給目標擁有者


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

使用我們設計的協議的 Token 會有以下的壞處：
1. 在此協議還沒廣泛普及之前，可能效果會不如預期，但如果今天發行商有採用這個協議，那有注意到此藝術品及其發行方式的人就會知道怎麼驗證 ownership
2. 由於驗證 ZKP 的過程是在合約中進行，這將導致 transfer ownership 的 Gas 耗費提高很多（相比之前沒有實作此協議的原始 ERC-721 合約）
3. 撰寫合約的技術門檻將會提高
4. 轉移 Token 的步驟會更複雜
5. 將 ownership 和 signership 解耦會導致每個 token 都需要紀錄一個 secret

但如果透過協議提供的 Interface，可以將門檻、步驟以及轉移資產的相關操作門檻降得非常低。同時如果錢包商支援此協議的 Token 的話，也能夠統一保管所有 Token 的 Secret，這是相對美好的想像，但需要達到協議預期的安全性本來就會需要付出一些代價，無論這些代價是技術上還是手續費成本上。不過如果今天這個鏈上證明或鏈上藝術品是地契或國寶，那或許多幾層保護是更好的。

另外，關於 ZKP 在坊間與多媒體的討論其實並不少，但大部分都是將多媒體的部分或全體進行模糊化、銳利化、方向顛倒等影像處理，這對藝術品來說其實毫無意義，因為多媒體資產便是拿來欣賞的，如果將其全盤掩蓋藏起來的話，不免失去了藝術品與實用價值的意義。

---

## 7. Reference

- [Tornado Cash]()
