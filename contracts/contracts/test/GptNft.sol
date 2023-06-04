// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

error GptNftMetadata__URI_QueryFor_NonExistentToken();

contract GptNft is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    event NftMinted(uint256 indexed tokenId, string indexed imageURI);

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => string) private s_tokenIdToUri;  //tokenId -> tokenURI

    constructor() ERC721("GptNft", "GFT") {}

    function mintNft(string memory tokenUri) public {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        s_tokenIdToUri[tokenId] = tokenUri;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);
        emit NftMinted(tokenId, tokenUri);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        if (!_exists(tokenId)) {
            revert GptNftMetadata__URI_QueryFor_NonExistentToken();
        }
        return super.tokenURI(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
