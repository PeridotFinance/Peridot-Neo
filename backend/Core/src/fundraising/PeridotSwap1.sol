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

/**
 * @title PeridotSwap
 * @dev This contract handles the swapping mechanisms between MiniNFTs, FFT tokens, and NFTs.
 * It includes functionalities for swapping MiniNFTs to FFT tokens, FFT tokens to MiniNFTs,
 * and MiniNFTs to NFTs. It also manages token relations and handles taxes associated with swaps.
 */
contract PeridotSwap is
    ERC721Holder, // Enables the contract to hold ERC721 tokens
    ERC1155Holder, // Enables the contract to hold ERC1155 tokens
    Ownable, // Provides ownership control functionalities
    IPeridotSwap, // Implements the IPeridotSwap interface
    ReentrancyGuard // Protects against reentrancy attacks
{
    // Swap rate determines how many FFT tokens are minted per MiniNFT
    uint256 public swapRate = 1E21;

    // Tax rates for FFT and MiniNFT transactions (expressed in wei, e.g., 3E16 = 3%)
    uint256 public fftTax = 3E16; // 3%
    uint256 public nftTax = 1E16; // 1%

    // Address of the PeridotTokenFactory contract
    address public tokenFactory;

    // Address designated to receive request IDs
    address public requestIdRecipient;

    // Mapping from NFT contract addresses to arrays of NFT IDs held by this contract
    mapping(address => uint256[]) public NFTIds;

    // Mapping from NFT contract addresses to their corresponding MiniNFT contract addresses
    mapping(address => address) public NFTtoMiniNFT;

    // Mapping from MiniNFT contract addresses to their corresponding FFT contract addresses
    mapping(address => address) public miniNFTtoFFT;

    /**
     * @dev Modifier to restrict functions to only be callable by the DAO.
     */
    modifier onlyDAO() {
        address dao = IPeridotTokenFactory(tokenFactory).getDAOAddress();
        require(msg.sender == dao, "Peridot: caller is not Peridot DAO");
        _;
    }

    /**
     * @dev Modifier to restrict functions to only be callable by the Token Factory or the contract owner.
     */
    modifier onlyFactoryOrOwner() {
        require(
            msg.sender == tokenFactory || msg.sender == owner(),
            "Invalid Caller"
        );
        _;
    }

    /**
     * @notice Constructor for the PeridotSwap contract.
     * Initializes the contract without setting any initial parameters.
     */
    constructor() {}

    /**
     * @notice Updates the relationship between MiniNFTs, FFTs, and NFTs.
     * Can only be called by the Token Factory or the contract owner.
     * @param miniNFT Address of the MiniNFT contract.
     * @param FFT Address of the FFT contract.
     * @param NFT Address of the NFT contract.
     * @return A boolean indicating the success of the operation.
     */
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

    /**
     * @notice Allows users to claim a BlindBox associated with a MiniNFT.
     * @param miniNFTContract Address of the MiniNFT contract.
     * @param tokenID ID of the token to claim.
     * @return A boolean indicating the success of the claim.
     */
    function poolClaim(
        address miniNFTContract,
        uint256 tokenID
    ) external virtual override returns (bool) {
        require(
            miniNFTtoFFT[miniNFTContract] != address(0),
            "swap: invalid contract"
        );
        require(IPeridotMiniNFT(miniNFTContract).claimBlindBox(tokenID) > 0, "swap: claim failed");

        emit PoolClaim(msg.sender, miniNFTContract, tokenID);
        return true;
    }

    /**
     * @notice Swaps MiniNFTs for FFT tokens.
     * Transfers MiniNFTs from the user to the contract and mints FFT tokens to the user.
     * @param miniNFTContract Address of the MiniNFT contract.
     * @param tokenID ID of the MiniNFT to swap.
     * @param amount Amount of MiniNFTs to swap.
     * @return A boolean indicating the success of the swap.
     */
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

        // Transfer MiniNFTs from the user to the contract
        IERC1155(miniNFTContract).safeTransferFrom(
            msg.sender,
            address(this),
            tokenID,
            amount,
            ""
        );

        // Mint FFT tokens to the user based on the swap rate
        require(
            IPeridotFFT(miniNFTtoFFT[miniNFTContract]).swapmint(
                amount * swapRate,
                msg.sender
            ),
            "swap: FFT minting failed"
        );

        emit SwapMiniNFTtoFFT(msg.sender, miniNFTContract, tokenID, amount);
        return true;
    }

    /**
     * @notice Swaps MiniNFTs for NFTs.
     * Burns MiniNFTs, collects tax, and transfers a random NFT to the user.
     * @param NFTContract Address of the NFT contract to receive.
     * @return A boolean indicating the success of the swap.
     */
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
        uint256 feeAmount = (nftTax * miniNFTAmount) / 1e18; // Calculate the fee based on the number of MiniNFTs

        // Ensure the user has enough MiniNFTs
        require(
            IERC1155(miniNFTContract).balanceOf(msg.sender, 0) >= miniNFTAmount,
            "swap: insufficient miniNFT balance"
        );

        // Transfer MiniNFTs from the user to the contract
        IERC1155(miniNFTContract).safeTransferFrom(
            msg.sender,
            address(this),
            0,
            miniNFTAmount,
            ""
        );

        // Burn the transferred MiniNFTs
        IPeridotMiniNFT(miniNFTContract).burn(miniNFTAmount);

        // Transfer the fee in MiniNFTs to the vault
        IERC1155(miniNFTContract).safeTransferFrom(
            address(this),
            IPeridotTokenFactory(tokenFactory).getVaultAddress(),
            0,
            feeAmount,
            ""
        );

        // Select and transfer a random NFT to the sender
        uint256 NFTNumber = NFTIds[NFTContract].length;
        require(NFTNumber > 0, "swap: no NFT left");
        uint256 NFTIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % NFTNumber;
        uint256 NFTID = NFTIds[NFTContract][NFTIndex];

        // Remove the selected NFT from the list to prevent reuse
        NFTIds[NFTContract][NFTIndex] = NFTIds[NFTContract][NFTNumber - 1];
        NFTIds[NFTContract].pop();

        // Transfer the selected NFT to the user
        IERC721(NFTContract).safeTransferFrom(address(this), msg.sender, NFTID);

        emit SwapMiniNFTtoNFT(msg.sender, NFTContract, NFTID);
        return true;
    }

    /**
     * @notice Swaps FFT tokens for MiniNFTs.
     * Burns FFT tokens from the user, collects tax, and transfers MiniNFTs to the user.
     * @param miniNFTContract Address of the MiniNFT contract.
     * @param miniNFTAmount Amount of MiniNFTs to mint.
     * @return A boolean indicating the success of the swap.
     */
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
            "swap: insufficient miniNFT in pool"
        );

        uint256 FFTamount = miniNFTAmount * swapRate;
        uint256 taxfee = (miniNFTAmount * fftTax) / 1e18;

        // Burn FFT tokens from the user's balance
        require(
            IPeridotFFT(miniNFTtoFFT[miniNFTContract]).burnFrom(
                msg.sender,
                FFTamount
            ),
            "swap: FFT burn failed"
        );

        // Transfer the tax fee to the vault
        require(
            IPeridotFFT(miniNFTtoFFT[miniNFTContract]).transferFrom(
                msg.sender,
                IPeridotTokenFactory(tokenFactory).getVaultAddress(),
                taxfee
            ),
            "swap: FFT tax transfer failed"
        );

        // Transfer MiniNFTs from the contract to the user
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

    /**
     * @notice Swaps NFTs to MiniNFTs.
     * Transfers an NFT from the owner to the contract and mints MiniNFTs to the user.
     * Can only be called by the DAO.
     * @param NFTContract Address of the NFT contract.
     * @param fromOwner Address of the NFT owner.
     * @param tokenId ID of the NFT to swap.
     * @return A boolean indicating the success of the swap.
     */
    function swapNFTtoMiniNFT(
        address NFTContract,
        address fromOwner,
        uint256 tokenId
    ) external virtual override onlyDAO nonReentrant returns (bool) {
        address miniNFTContract = NFTtoMiniNFT[NFTContract];

        require(miniNFTContract != address(0), "swap: invalid contract");

        // Transfer the NFT from the owner to the contract
        IERC721(NFTContract).safeTransferFrom(
            fromOwner,
            address(this),
            tokenId
        );

        // Mint MiniNFTs to the user
        require(IPeridotMiniNFT(miniNFTContract).swapmint(1000, fromOwner), "swap: MiniNFT minting failed");

        return true;
    }

    /**
     * @notice Withdraws ERC20 tokens from the contract to the DAO.
     * Can only be called by the DAO.
     * @param project Address of the ERC20 token contract.
     * @param amount Amount of tokens to withdraw.
     * @return A boolean indicating the success of the withdrawal.
     */
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

    /**
     * @notice Withdraws ERC721 tokens (NFTs) from the contract to the DAO.
     * Can only be called by the DAO and ensures that ProjectNFTs cannot be withdrawn.
     * @param airdropContract Address of the ERC721 contract.
     * @param tokenId ID of the NFT to withdraw.
     * @return A boolean indicating the success of the withdrawal.
     */
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

    /**
     * @notice Withdraws ERC1155 tokens (MiniNFTs) from the contract to the DAO.
     * Can only be called by the DAO and ensures that ProjectNFTs cannot be withdrawn.
     * @param airdropContract Address of the ERC1155 contract.
     * @param tokenId ID of the MiniNFT to withdraw.
     * @param amount Amount of MiniNFTs to withdraw.
     * @return A boolean indicating the success of the withdrawal.
     */
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

    /**
     * @notice Updates the address of the Token Factory contract.
     * Can only be called by the contract owner.
     * @param factory_ New address of the Token Factory.
     * @return A boolean indicating the success of the update.
     */
    function updateFactory(address factory_) external onlyOwner returns (bool) {
        // Uncomment the line below if you want to restrict the factory to be set only once
        // require(tokenFactory == address(0), 'swap: factory has been set');
        require(factory_ != address(0), "swap: factory can not be 0 address");

        tokenFactory = factory_;

        emit UpdateFactory(factory_);
        return true;
    }

    /**
     * @notice Updates the tax rates for FFT and MiniNFT transactions.
     * Can only be called by the DAO.
     * @param fftTax_ New tax rate for FFT transactions.
     * @param nftTax_ New tax rate for MiniNFT transactions.
     * @return A boolean indicating the success of the update.
     */
    function updateTax(
        uint256 fftTax_,
        uint256 nftTax_
    ) external onlyDAO returns (bool) {
        fftTax = fftTax_;
        nftTax = nftTax_;

        emit UpdateTax(fftTax_, nftTax_);
        return true;
    }

    /**
     * @notice Handles the receipt of an ERC721 token.
     * Stores the received NFT ID in the NFTIds mapping.
     * @param operator The address which called `safeTransferFrom` function.
     * @param from The address which previously owned the token.
     * @param tokenId The NFT identifier which is being transferred.
     * @param data Additional data with no specified format.
     * @return The Solidity selector for this function.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public override(ERC721Holder) returns (bytes4) {
        NFTIds[msg.sender].push(tokenId);
        return this.onERC721Received.selector;
    }

    /**
     * @notice Returns the number of NFTs available for a specific NFT contract.
     * @param NFTContract Address of the NFT contract.
     * @return The number of NFTs available.
     */
    function numberOfNFT(address NFTContract) external view returns (uint256) {
        return NFTIds[NFTContract].length;
    }

    /**
     * @notice Withdraws Ether from the contract to the DAO.
     * Can only be called by the DAO.
     * @return A boolean indicating the success of the withdrawal.
     */
    function withdrawEther() external onlyDAO returns (bool) {
        uint256 amount = address(this).balance;
        address dao = msg.sender;
        payable(dao).transfer(amount);

        return true;
    }

    /**
     * @notice Fallback function to accept Ether transfers.
     */
    receive() external payable {}
}

/**
 * @notice Emitted when the pool relation between MiniNFT, FFT, and NFT is updated.
 * @param updater The address that performed the update.
 * @param miniNFT The address of the MiniNFT contract.
 * @param FFT The address of the FFT contract.
 * @param NFT The address of the NFT contract.
 */
event UpdatePoolRelation(
    address indexed updater,
    address indexed miniNFT,
    address indexed FFT,
    address NFT
);

/**
 * @notice Emitted when a pool claim is successfully made.
 * @param claimer The address that made the claim.
 * @param miniNFTContract The address of the MiniNFT contract involved in the claim.
 * @param tokenID The ID of the token claimed.
 */
event PoolClaim(
    address indexed claimer,
    address indexed miniNFTContract,
    uint256 tokenID
);

/**
 * @notice Emitted when a MiniNFT is swapped for FFT tokens.
 * @param swapper The address that performed the swap.
 * @param miniNFTContract The address of the MiniNFT contract.
 * @param tokenID The ID of the MiniNFT token.
 * @param amount The amount of MiniNFTs swapped.
 */
event SwapMiniNFTtoFFT(
    address indexed swapper,
    address indexed miniNFTContract,
    uint256 tokenID,
    uint256 amount
);

/**
 * @notice Emitted when MiniNFTs are swapped for an NFT.
 * @param swapper The address that performed the swap.
 * @param NFTContract The address of the NFT contract.
 * @param NFTID The ID of the NFT received.
 */
event SwapMiniNFTtoNFT(
    address indexed swapper,
    address indexed NFTContract,
    uint256 NFTID
);

/**
 * @notice Emitted when FFT tokens are swapped for MiniNFTs.
 * @param swapper The address that performed the swap.
 * @param miniNFTContract The address of the MiniNFT contract.
 * @param miniNFTAmount The amount of MiniNFTs received.
 */
event SwapFFTtoMiniNFT(
    address indexed swapper,
    address indexed miniNFTContract,
    uint256 miniNFTAmount
);

/**
 * @notice Emitted when the Token Factory address is updated.
 * @param newFactory The new address of the Token Factory.
 */
event UpdateFactory(address indexed newFactory);

/**
 * @notice Emitted when the tax rates are updated.
 * @param newFFTTax The new tax rate for FFT transactions.
 * @param newNFTTax The new tax rate for MiniNFT transactions.
 */
event UpdateTax(uint256 newFFTTax, uint256 newNFTTax);