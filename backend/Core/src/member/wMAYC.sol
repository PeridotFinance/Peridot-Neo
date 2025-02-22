// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WrappedMAYC is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    uint256 public constant MAX_SUPPLY = 20000;
    string public defaulturi =
        "https://ipfs.io/ipfs/bafkreicf36h66xrhkso2wytsp5wuzkwons6jnnw47yvz6b5nogxi6guymm";
    string private _baseuri = "";

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Wrapped Mutant Ape Yacht Club", "WMAYC") {}

    function safeMint(address to) public onlyOwner {
        require(MAX_SUPPLY > _tokenIdCounter.current(), "Max supply reached");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function batchSafeMint(address to, uint256 amount) external onlyOwner {
        require(MAX_SUPPLY > _tokenIdCounter.current(), "Max supply reached");
        uint256 tokenId;
        for (uint256 i = 0; i < amount; i++) {
            tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(to, tokenId);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseuri;
    }

    function setBaseURI(string memory uri) external onlyOwner {
        _baseuri = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        string memory base = _baseURI();
        // If there is no base URI, return the default token URI.
        if (bytes(base).length == 0) {
            return defaulturi;
        }
        return string(abi.encodePacked(base, Strings.toString(tokenId)));
    }
}
