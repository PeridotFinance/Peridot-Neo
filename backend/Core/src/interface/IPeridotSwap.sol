// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IPeridotSwap {
    event UpdatePoolRelation(
        address editor,
        address miniNFT,
        address FFT,
        address NFT
    );

    event PoolClaim(address owner, address miniNFTcontract, uint256 tokenID);

    event SwapMiniNFTtoFFT(
        address owner,
        address miniNFTcontract,
        uint256 tokenID,
        uint256 miniNFTAmount
    );

    event SwapFFTtoMiniNFT(
        address owner,
        address miniNFTcontract,
        uint256 miniNFTAmount
    );

    event SwapMiniNFTtoNFT(address owner, address NFTContract, uint256 NFTID);

    event UpdateFactory(address factory);

    event UpdateTax(uint256 fftTax, uint256 nftTax);

    function updatePoolRelation(
        address miniNFT,
        address FFT,
        address NFT
    ) external returns (bool);

    function poolClaim(
        address miniNFTcontract,
        uint256 tokenID
    ) external returns (bool);

    function swapMiniNFTtoFFT(
        address miniNFTcontract,
        uint256 tokenID,
        uint256 amount
    ) external returns (bool);

    function swapFFTtoMiniNFT(
        address miniNFTcontract,
        uint256 miniNFTamount
    ) external returns (bool);

    function swapMiniNFTtoNFT(address NFTContract) external returns (bool);

    function swapNFTtoMiniNFT(
        address NFTContract,
        address fromOwner,
        uint256 tokenId
    ) external returns (bool);
}
