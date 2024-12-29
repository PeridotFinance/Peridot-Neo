// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interface/IPeridotMiniNFT.sol";
import "../interface/IPeridotFFT.sol";
import "../interface/IPeridotSwap.sol";
import "../interface/IPeridotTokenFactory.sol";

contract PeridotSwap is
    ERC721Holder,
    ERC1155Holder,
    Ownable,
    IPeridotSwap,
    ReentrancyGuard
{
    uint256 public swapRate = 1E21;
    uint256 public fftTax = 3E16; //3%
    uint256 public nftTax = 1E16; //1%

    address public tokenFactory;
    address public requestIdRecipient;

    mapping(address => uint256[]) public NFTIds;
    mapping(address => address) public NFTtoMiniNFT;
    mapping(address => address) public miniNFTtoFFT;

    modifier onlyDAO() {
        address dao = IPeridotTokenFactory(tokenFactory).getDAOAddress();
        require(msg.sender == dao, "Peridot: caller is not Peridot DAO");
        _;
    }

    modifier onlyFactoryOrOwner() {
        require(
            msg.sender == tokenFactory || msg.sender == owner(),
            "Invalid Caller"
        );
        _;
    }

    constructor() {}

    function updatePoolRelation(
        address miniNFT,
        address FFT,
        address NFT
    ) external onlyFactoryOrOwner returns (bool) {
        miniNFTtoFFT[miniNFT] = FFT;
        NFTtoMiniNFT[NFT] = miniNFT;
        emit UpdatePoolRelation(msg.sender, miniNFT, FFT, NFT);
        return true;
    }

    function poolClaim(
        address miniNFTContract,
        uint256 tokenID
    ) external virtual override returns (bool) {
        require(
            miniNFTtoFFT[miniNFTContract] != address(0),
            "swap: invalid contract"
        );
        require(IPeridotMiniNFT(miniNFTContract).claimBlindBox(tokenID) > 0);

        emit PoolClaim(msg.sender, miniNFTContract, tokenID);
        return true;
    }

    function swapMiniNFTtoFFT(
        address miniNFTContract,
        uint256 tokenID,
        uint256 amount
    ) external virtual override nonReentrant returns (bool) {
        require(
            miniNFTtoFFT[miniNFTContract] != address(0),
            "swap: invalid contract"
        );

        uint256 miniNFTBalance = IERC1155(miniNFTContract).balanceOf(
            msg.sender,
            tokenID
        );
        require(miniNFTBalance >= amount, "swap: balance insufficient");

        IERC1155(miniNFTContract).safeTransferFrom(
            msg.sender,
            address(this),
            tokenID,
            amount,
            ""
        );

        require(
            IPeridotFFT(miniNFTtoFFT[miniNFTContract]).swapmint(
                amount * swapRate,
                msg.sender
            )
        );

        emit SwapMiniNFTtoFFT(msg.sender, miniNFTContract, tokenID, amount);
        return true;
    }

    function swapMiniNFTtoNFT(
        address NFTContract
    ) external nonReentrant returns (bool) {
        require(
            NFTtoMiniNFT[NFTContract] != address(0),
            "swap: invalid contract"
        );
        require(NFTIds[NFTContract].length > 0, "swap: no NFT left");

        address miniNFTContract = NFTtoMiniNFT[NFTContract];
        uint256 miniNFTAmount = 1000;
        uint256 feeAmount = (nftTax * miniNFTAmount) / 1e18; // Calculate the fee based on the number of miniNFTs

        // Ensure the user has enough miniNFTs
        require(
            IERC1155(miniNFTContract).balanceOf(msg.sender, 0) >= miniNFTAmount,
            "swap: insufficient miniNFT balance"
        );

        // Transfer miniNFTs from the user to the contract
        IERC1155(miniNFTContract).safeTransferFrom(
            msg.sender,
            address(this),
            0,
            miniNFTAmount,
            ""
        );

        // Burn the miniNFTs
        IPeridotMiniNFT(miniNFTContract).burn(miniNFTAmount);

        // Transfer the fee in miniNFTs to the vault
        IERC1155(miniNFTContract).safeTransferFrom(
            address(this),
            IPeridotTokenFactory(tokenFactory).getVaultAddress(),
            0,
            feeAmount,
            ""
        );

        // Select and transfer the NFT to the sender
        uint256 NFTNumber = NFTIds[NFTContract].length;
        require(NFTNumber > 0, "swap: no NFT left");
        uint256 NFTIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % NFTNumber;
        uint256 NFTID = NFTIds[NFTContract][NFTIndex];

        // Remove the NFT from the list (swap logic)
        NFTIds[NFTContract][NFTIndex] = NFTIds[NFTContract][NFTNumber - 1];
        NFTIds[NFTContract].pop();

        // Transfer the selected NFT to the sender
        IERC721(NFTContract).safeTransferFrom(address(this), msg.sender, NFTID);

        // Emit event for swap completion
        emit SwapMiniNFTtoNFT(msg.sender, NFTContract, NFTID);
        return true;
    }

    function swapFFTtoMiniNFT(
        address miniNFTContract,
        uint256 miniNFTAmount
    ) external virtual override nonReentrant returns (bool) {
        require(
            miniNFTtoFFT[miniNFTContract] != address(0),
            "swap: invalid contract"
        );
        require(
            IERC1155(miniNFTContract).balanceOf(address(this), 0) >=
                miniNFTAmount,
            "swap:insufficient miniNFT in pool"
        );
        uint256 FFTamount = miniNFTAmount * swapRate;
        uint256 taxfee = (miniNFTAmount * fftTax) / 1e18;

        require(
            IPeridotFFT(miniNFTtoFFT[miniNFTContract]).burnFrom(
                msg.sender,
                FFTamount
            )
        );

        require(
            IPeridotFFT(miniNFTtoFFT[miniNFTContract]).transferFrom(
                msg.sender,
                IPeridotTokenFactory(tokenFactory).getVaultAddress(),
                taxfee
            )
        );
        IERC1155(miniNFTContract).safeTransferFrom(
            address(this),
            msg.sender,
            0,
            miniNFTAmount,
            ""
        );

        emit SwapFFTtoMiniNFT(msg.sender, miniNFTContract, miniNFTAmount);
        return true;
    }

    function swapNFTtoMiniNFT(
        address NFTContract,
        address fromOwner,
        uint256 tokenId
    ) external virtual override onlyDAO nonReentrant returns (bool) {
        address miniNFTContract = NFTtoMiniNFT[NFTContract];

        require(miniNFTContract != address(0), "swap: invalid contract");

        IERC721(NFTContract).safeTransferFrom(
            fromOwner,
            address(this),
            tokenId
        );

        require(IPeridotMiniNFT(miniNFTContract).swapmint(1000, fromOwner));

        return true;
    }

    function withdrawERC20(
        address project,
        uint256 amount
    ) external onlyDAO returns (bool) {
        require(
            IERC20(project).transfer(msg.sender, amount),
            "swap: withdraw failed"
        );
        return true;
    }

    function withdrawERC721(
        address airdropContract,
        uint256 tokenId
    ) external onlyDAO returns (bool) {
        require(
            NFTtoMiniNFT[airdropContract] == address(0),
            "swap: cannot withdraw ProjectNFT"
        );

        IERC721(airdropContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        return true;
    }

    function withdrawERC1155(
        address airdropContract,
        uint256 tokenId,
        uint256 amount
    ) external onlyDAO returns (bool) {
        require(
            miniNFTtoFFT[airdropContract] == address(0),
            "swap: cannot withdraw ProjectNFT"
        );

        IERC1155(airdropContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ""
        );

        return true;
    }

    function updateFactory(address factory_) external onlyOwner returns (bool) {
        //require(tokenFactory == address(0), 'swap: factory has been set');
        require(factory_ != address(0), "swap: factory can not be 0 address");

        tokenFactory = factory_;

        emit UpdateFactory(factory_);
        return true;
    }

    function updateTax(
        uint256 fftTax_,
        uint256 nftTax_
    ) external onlyDAO returns (bool) {
        fftTax = fftTax_;
        nftTax = nftTax_;

        emit UpdateTax(fftTax_, nftTax_);
        return true;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public override(ERC721Holder) returns (bytes4) {
        NFTIds[msg.sender].push(tokenId);
        return this.onERC721Received.selector;
    }

    function numberOfNFT(address NFTContract) external view returns (uint256) {
        return NFTIds[NFTContract].length;
    }

    function withdrawEther() external onlyDAO returns (bool) {
        uint256 amount = address(this).balance;
        address dao = msg.sender;
        payable(dao).transfer(amount);

        return true;
    }

    receive() external payable {}
}
