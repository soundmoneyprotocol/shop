// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

/**
 * @title CreatorToken
 * @notice ERC1155 tokens representing authenticity and ownership of creator products
 * Each product listing gets a unique token ID
 */
contract CreatorToken is ERC1155, Ownable, ERC1155Burnable {

    uint256 private _nextTokenId = 1;

    mapping(uint256 => string) private _uris;
    mapping(uint256 => address) public tokenCreators;
    mapping(uint256 => uint256) public tokenMaxSupply;
    mapping(uint256 => uint256) public tokenMintedAmount;

    event TokenCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string uri,
        uint256 maxSupply
    );

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint256 amount
    );

    constructor() ERC1155("") {}

    /**
     * @notice Create a new token type for a product
     * @param _creator Address of the product creator
     * @param _uri Metadata URI (JSON with product details)
     * @param _maxSupply Maximum number of tokens that can be minted
     * @return tokenId The ID of the newly created token
     */
    function createProductToken(
        address _creator,
        string calldata _uri,
        uint256 _maxSupply
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _uris[tokenId] = _uri;
        tokenCreators[tokenId] = _creator;
        tokenMaxSupply[tokenId] = _maxSupply;
        tokenMintedAmount[tokenId] = 0;

        emit TokenCreated(tokenId, _creator, _uri, _maxSupply);
        _nextTokenId++;

        return tokenId;
    }

    /**
     * @notice Mint tokens for a purchase
     * @param _tokenId The token ID to mint
     * @param _to Address to mint to
     * @param _amount Number of tokens to mint
     */
    function mintForPurchase(
        uint256 _tokenId,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        require(_tokenId < _nextTokenId, "Invalid token ID");
        require(
            tokenMintedAmount[_tokenId] + _amount <= tokenMaxSupply[_tokenId],
            "Exceeds max supply"
        );

        _mint(_to, _tokenId, _amount, "");
        tokenMintedAmount[_tokenId] += _amount;

        emit TokenMinted(_tokenId, _to, _amount);
    }

    /**
     * @notice Get URI for token metadata
     * @param _tokenId Token ID
     * @return Token URI
     */
    function uri(uint256 _tokenId) public view override returns (string memory) {
        return _uris[_tokenId];
    }

    /**
     * @notice Update URI for token metadata
     * @param _tokenId Token ID
     * @param _newUri New URI
     */
    function setUri(uint256 _tokenId, string calldata _newUri) external onlyOwner {
        _uris[_tokenId] = _newUri;
    }

    /**
     * @notice Check if token is fully minted
     * @param _tokenId Token ID
     * @return true if token has reached max supply
     */
    function isTokenFullyMinted(uint256 _tokenId) external view returns (bool) {
        return tokenMintedAmount[_tokenId] >= tokenMaxSupply[_tokenId];
    }

    /**
     * @notice Get remaining supply for token
     * @param _tokenId Token ID
     * @return Remaining tokens that can be minted
     */
    function getRemainingSupply(uint256 _tokenId) external view returns (uint256) {
        return tokenMaxSupply[_tokenId] - tokenMintedAmount[_tokenId];
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
