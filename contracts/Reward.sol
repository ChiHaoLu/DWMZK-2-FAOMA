// SPDX-License-Identifier: Apache License
// compiler version must be greater than or equal to 0.8.17 and less than 0.9.0
pragma solidity ^0.8.17;

import "./ConsumeMsg.sol";

interface IERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

interface IERC721 is IERC165 {
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId)
        external
        view
        returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);
}

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

interface IERC721Metadata is IERC721 {

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

}

contract ERC721 is IERC721Metadata, ConsumeMsg  {

    string private _name;
    string private _symbol;
    bool private isAcceptedToTransfer;

    constructor(string memory __name, string memory __symbol) {
        _name = __name;
        _symbol = __symbol;
    }

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed id
    );
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 indexed id
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    // Mapping from token ID to owner address
    mapping(uint256 => address) internal _ownerOf;

    // Mapping owner address to token count
    mapping(address => uint256) internal _balanceOf;

    // Mapping from token ID to approved address
    mapping(uint256 => address) internal _approvals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }
    
    function supportsInterface(bytes4 interfaceId)
        external
        pure
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    function ownerOf(uint256 id) external view returns (address owner) {
        owner = _ownerOf[id];
        require(owner != address(0), "token doesn't exist");
    }

    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "owner = zero address");
        return _balanceOf[owner];
    }

    function setApprovalForAll(address operator, bool approved) external {
        require(operator != msg.sender, "approve to owner");
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function approve(address spender, uint256 id) external {
        address owner = _ownerOf[id];
        require(owner != address(0), "token not exist");
        require(
            msg.sender == owner || isApprovedForAll[owner][msg.sender],
            "not authorized"
        );
        require(owner != spender, "approve to owner");

        _approvals[id] = spender;

        emit Approval(owner, spender, id);
    }

    function getApproved(uint256 id) external view returns (address) {
        require(_ownerOf[id] != address(0), "token doesn't exist");
        return _approvals[id];
    }

    function _isApprovedOrOwner(
        address owner,
        address spender,
        uint256 id
    ) internal view returns (bool) {
        return (spender == owner ||
            isApprovedForAll[owner][spender] ||
            spender == _approvals[id]);
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public {
        require(from == _ownerOf[id], "from != owner");
        require(to != address(0), "transfer to zero address");
        require(_isApprovedOrOwner(from, msg.sender, id), "not authorized");
        require(isAcceptedToTransfer, "you cannot transfer your Reward NFT"); // to make NFT untransferable
        _balanceOf[from]--;
        _balanceOf[to]++;
        _ownerOf[id] = to;

        delete _approvals[id];

        emit Transfer(from, to, id);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) external {
        transferFrom(from, to, id);

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
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes calldata data
    ) external {
        transferFrom(from, to, id);

        require(
            to.code.length == 0 ||
                IERC721Receiver(to).onERC721Received(
                    msg.sender,
                    from,
                    id,
                    data
                ) ==
                IERC721Receiver.onERC721Received.selector,
            "unsafe recipient"
        );
    }

    function _mint(
        bool _flag,
        address _solver,
        uint256 id,
        uint256 _problemNumber,
        uint256 _timestamp,
        address _approverKeyAddr,
        uint8 _approverIndex,
        bytes memory _signature
    ) internal {
        require(_solver != address(0), "mint to zero address");
        require(_ownerOf[id] == address(0), "already minted");
        require(msg.sender == _solver, "invalid msg sender");
        if(_flag){
            require(VerifySignature(
                _solver,
                _problemNumber,
                _timestamp,
                _approverKeyAddr,   
                _approverIndex,
                _signature
            ), "not verified signer");
        }
        _balanceOf[_solver]++;
        _ownerOf[id] = _solver;
        emit Transfer(address(0), _solver, id);
    }

    function _burn(uint256 id) internal virtual {
        address owner = _ownerOf[id];
        require(owner != address(0), "not minted");

        _balanceOf[owner] -= 1;

        delete _ownerOf[id];
        delete _approvals[id];

        emit Transfer(owner, address(0), id);
    }

    function _exists(uint256 id) internal view returns(bool) {
        return _ownerOf[id] != address(0);
    }

    function _setIsAcceptedToTransfer(bool _transferStatus) internal {
        isAcceptedToTransfer = _transferStatus;
    }
}

abstract contract ERC721URIStorage is ERC721 {

    // tokenId => tokenURI
    mapping(uint256 => string) internal _tokenURIs;

    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {

        string memory _tokenURI = _tokenURIs[tokenId];

        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(_tokenURI));
        }

        return _tokenURIs[tokenId];
    }

    function _setTokenURI(uint256 id, string memory _tokenURI) internal virtual {
        require(_exists(id), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[id] = _tokenURI;
    }

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}

contract Reward is ERC721URIStorage {

    uint256 private id = 0;
    uint256 private nowTotal = 101;
    bool serverFlag = true;

    mapping(address => bool) private owners;
    mapping(address => mapping (uint256 => uint256)) internal SolvingStatus;

    event SetOwner(address, address);
    event TransferStatus(address, bool); 

    constructor() ERC721("DappChefRewardNFT", "DCR") {
        owners[msg.sender] = true;
    }

    modifier onlyOwner(address msgSender) {
        require(owners[msgSender] == true, "not contract owners");
        _;
    }

    function turnServer(bool _flag) external onlyOwner(msg.sender) {
        serverFlag = _flag;
    }

    function mint(
        address _solver,
        uint256 _problemNumber,
        uint256 _timestamp,
        address _approverKeyAddr,
        uint8 _approverIndex,
        bytes memory _signature,
        string memory _tokenURI
    ) external {
        require(SolvingStatus[msg.sender][_problemNumber] == 0, "already minted the same token");
        _mint(serverFlag, _solver, id, _problemNumber, _timestamp, _approverKeyAddr, _approverIndex, _signature);
        _setTokenURI(id, _tokenURI);
        SolvingStatus[msg.sender][_problemNumber] = id + 1;
        id += 1;
    }

    function getSolvingStatus(address account) public view returns ( uint256, uint256[] memory) {
        uint256[] memory arr = new uint256[](nowTotal);
        uint256 length = 0;
        for (uint256 i = 0; i < nowTotal; i++) {
            if (SolvingStatus[account][i] > 0) {
                arr[length] = i;
                length++;
            }
        }
        return (length, arr);
    }

    function getTokenID (address account, uint _problemNumber) public view returns (uint) {
      int256 tmp = int256(SolvingStatus[account][_problemNumber]);
      require(tmp - 1 >= 0, "haven't answered this problem correctly");
      require (tmp > 0, "SolvingStatus < 0");
      return SolvingStatus[account][_problemNumber] - 1;
    } 

    function burn(uint256 _id) external {
        require(_ownerOf[_id] != address(0), "token doesn't exist");
        require(msg.sender == _ownerOf[_id], "not owner");
        _burn(_id);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }
    
    // only owners can execute the functions below 
    function setOwner(address _owner) public onlyOwner(msg.sender) {
        owners[_owner] = true;
        emit SetOwner(msg.sender, _owner);
    }

    function setIsAcceptedToTransfer(bool _transferStatus) public onlyOwner(msg.sender) {
        _setIsAcceptedToTransfer(_transferStatus);
        emit TransferStatus(msg.sender, _transferStatus);
    }

    function getNowTotal() public view onlyOwner(msg.sender) returns (uint256) {
        return nowTotal;
    }

    function setNowTotal(uint256 _nowTotal) public onlyOwner(msg.sender) {
        nowTotal = _nowTotal;
    }
}
