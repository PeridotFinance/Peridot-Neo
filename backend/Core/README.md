# Peridot Core Smart Contract Suite

Welcome to the Peridot Core Smart Contract Suite! This comprehensive collection of smart contracts is designed to facilitate fundraising, token management, fraction minting, and swapping mechanisms within the Peridot ecosystem. This README provides an extensive overview of the main contracts, their functionalities, and their interactions within the system.

FTT's are the Fractionalized Assets as ERC20
MiniNFT's are the Fractionalized Assets as ERC115

## Table of Contents

- [Introduction](#introduction)
- [Contracts Overview](#contracts-overview)
  - [PeridotTokenFactory](#peridottokenfactory)
  - [PeridotSwap](#peridotswap)
  - [PeridotMiniNFT](#peridotmininft)
  - [PeridotFFT](#peridotfft)
- [Supporting Libraries and Interfaces](#supporting-libraries-and-interfaces)
- [Key Functionalities](#key-functionalities)
  - [Token Pair Creation](#token-pair-creation)
  - [NFT Minting and Claiming](#nft-minting-and-claiming)
  - [Token Swapping](#token-swapping)
  - [Fee Management](#fee-management)
- [Event Logging](#event-logging)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)
- [Usage](#usage)
- [Conclusion](#conclusion)
- [Disclaimer](#disclaimer)

---

## Introduction

The Peridot Smart Contract Suite is meticulously architected to support a robust fundraising mechanism integrated with ERC20 and ERC1155 token standards. It facilitates the creation of token pairs, manages the minting and claiming of NFTs, and enables seamless swapping between different token types while ensuring security and efficiency.

---

## Contracts Overview

The Peridot Smart Contract Suite comprises several key contracts, each responsible for distinct functionalities within the ecosystem. Below is an overview of the most critical contracts:

### PeridotTokenFactory

**File Path:** `src/fundraising/PeridotTokenFactory.sol`

The `PeridotTokenFactory` contract serves as the central hub for deploying and managing token pairs within the Peridot ecosystem. It is responsible for creating new instances of `PeridotMiniNFT` and `PeridotFFT` contracts for various projects.

**Key Features:**

- **Ownership Management:** The factory has an owner who has exclusive rights to perform sensitive operations.
- **DAO Integration:** Certain functions are restricted to the DAO (Decentralized Autonomous Organization) to ensure community governance.
- **Pair Creation:** Facilitates the creation of MiniNFT and FFT token pairs for different projects using the `CREATE2` opcode for deterministic deployments.
- **Address Management:** Maintains mappings between project addresses and their corresponding MiniNFT and FFT contracts.
- **Vault Management:** Handles the addresses for the main vault and the pool funding vault, allowing updates through DAO governance.

**Important Functions:**

- `createCollectionPair`: Deploys new `PeridotMiniNFT` and `PeridotFFT` contracts for a project.
- `updateDao`: Updates the DAO address.
- `updateVault` & `updatePFVault`: Manage vault addresses pending DAO approval.
- Getter functions to retrieve owner, DAO, Swap, Vault, and Pool Funding Vault addresses.

**Access Control:**

- **Only Factory Owner:** Can create new collection pairs.
- **Only DAO:** Can update critical addresses like DAO itself and vaults.

### PeridotSwap

**File Path:** `src/fundraising/PeridotSwap1.sol`

The `PeridotSwap` contract facilitates the swapping mechanism between MiniNFTs, FFT tokens, and final NFTs. It manages the conversion rates, handles associated fees, and ensures secure transactions.

**Key Features:**

- **Swapping Mechanisms:** Enables conversions between MiniNFTs and FFT tokens, FFT tokens and MiniNFTs, and MiniNFTs to final NFTs.
- **Fee Implementation:** Implements taxes on FFT and NFT swaps to fund the ecosystem.
- **Vault Integration:** Directs collected fees to the designated vaults.
- **NFT Management:** Manages NFT holdings and ensures secure transfer upon swapping.

**Important Functions:**

- `updatePoolRelation`: Sets the relationship between MiniNFT contracts, FFT contracts, and NFT contracts.
- `poolClaim`: Allows claiming of NFTs based on MiniNFT ownership.
- `swapMiniNFTtoFFT`: Swaps MiniNFTs for FFT tokens.
- `swapFFTtoMiniNFT`: Swaps FFT tokens back to MiniNFTs.
- `swapMiniNFTtoNFT`: Converts MiniNFTs directly into final NFTs.
- `swapNFTtoMiniNFT`: Allows DAO to swap a final NFT back into MiniNFTs.
- Withdrawal functions for various token standards.
- `updateFactory` & `updateTax`: Manage factory address and tax rates.

**Access Control:**

- **Only DAO:** Can execute critical functions like updating pool relations, withdrawing funds, and updating tax rates.
- **Only Factory or Owner:** Responsible for initial setup and pairing of token contracts.

### PeridotMiniNFT

**File Path:** `src/fundraising/PeridotMiniNFT.sol`

The `PeridotMiniNFT` contract is an ERC1155 token that represents Mini Non-Fungible Tokens (MiniNFTs) within the Peridot ecosystem. It facilitates the minting of blind boxes and their subsequent claiming for NFTs.

**Key Features:**

- **Round-Based Sales:** Implements rounds for selling blind boxes with a cap per round.
- **Claim Mechanism:** Allows users to claim NFTs upon successful completion of sales rounds.
- **Integration with FFT:** Links MiniNFTs with FFT tokens for swapping mechanisms.
- **URI Management:** Supports dynamic setting of token URIs.

**Important Functions:**

- `startNewRound`: Initiates a new sale round with a specified blind box price.
- `closeRound`: Closes the active sale round.
- `mintBlindBox`: Allows users to purchase blind boxes using Ether.
- `claimBlindBox`: Users can claim an NFT by burning their blind box if the round succeeds.
- `swapmint`: Allows the Swap contract to mint MiniNFTs to users.
- `updateRoundSucceed`: Marks a round as successful, enabling claims.
- `updateBlindBoxPrice`: Updates the price of blind boxes.
- URI management functions: `updateDefaultURI` and `updateTokenURI`.

**Access Control:**

- **Only DAO:** Can start or close sale rounds, mark rounds as successful, and update blind box prices.
- **Only Swap Contract:** Authorized to mint MiniNFTs.

### PeridotFFT

**File Path:** `src/fundraising/PeridotFFT.sol`

The `PeridotFFT` contract is an ERC20 token representing the Peridot Fundraising Token (FFT). It includes functionalities for minting, transferring, burning tokens, and managing fees.

**Key Features:**

- **Fee Management:** Implements fees on transfers that are directed to specified vaults.
- **Minting Mechanism:** Only the Swap contract can mint new FFT tokens.
- **Exclusion from Fees:** Certain addresses can be excluded from transaction fees.
- **Upgradeable Fees:** DAO can update fee percentages.

**Important Functions:**

- `swapmint`: Mints FFT tokens to a specified address; restricted to the Swap contract.
- `transfer` & `transferFrom`: Override ERC20 functions to include fee mechanisms.
- `burnFrom`: Allows burning tokens from an address.
- `excludeFromFee` & `includeInFee`: Manage fee exclusions.
- `updateFee`: Update vault and pool funding vault fee percentages.

**Access Control:**

- **Only Swap Contract:** Authorized to mint new FFT tokens.
- **Only DAO:** Can exclude/include accounts from fees and update fee percentages.

---

## Supporting Libraries and Interfaces

### Create2

**File Path:** `@openzeppelin/contracts/utils/Create2.sol`

Provides utilities to deploy contracts using the `CREATE2` opcode, allowing for deterministic contract addresses based on the deployer's address, salt, and bytecode.

### PeridotFFTHelper

**File Path:** `src/library/PeridotFFTHelper.sol`

A helper library to generate the creation bytecode for the `PeridotFFT` contract. It streamlines the deployment process by encoding the constructor parameters needed for the FFT token.

### PeridotMiniNFTHelper

**File Path:** `src/library/PeridotMiniNFTHelper.sol`

Similar to `PeridotFFTHelper`, this helper library generates the bytecode for deploying the `PeridotMiniNFT` contract, encoding the necessary constructor parameters.

### Interfaces

**File Paths:**

- `src/interface/IPeridotFFT.sol`
- `src/interface/IPeridotTokenFactory.sol`
- `src/interface/IPeridotMiniNFT.sol`
- `src/interface/IPeridotSwap.sol`

Interfaces define the external functions and events that contracts implement, ensuring standardized interactions between different components of the suite.

---

## Key Functionalities

### Token Pair Creation

The `PeridotTokenFactory` uses `CREATE2` to deploy new instances of `PeridotMiniNFT` and `PeridotFFT` contracts. This deterministic deployment ensures that the addresses of these contracts can be precomputed and managed systematically.

**Steps:**

1. **Bytecode Generation:** Utilize helper libraries (`PeridotFFTHelper` and `PeridotMiniNFTHelper`) to generate the required bytecode with constructor parameters.
2. **Deployment via CREATE2:** Deploy the contracts using the `Create2.deploy` function with a unique salt.
3. **Relation Mapping:** Map the deployed MiniNFT and FFT contracts to their respective project addresses.
4. **Integration with Swap Contract:** Update the `PeridotSwap` contract to recognize the new token pairs.

### NFT Minting and Claiming

The `PeridotMiniNFT` contract manages the sale of blind boxes and the subsequent claiming of NFTs upon successful round completions.

**Process:**

1. **Start a Sale Round:** DAO initiates a new round with a specific blind box price.
2. **Mint Blind Boxes:** Users purchase blind boxes by sending Ether to the `mintBlindBox` function.
3. **Close Round:** Once the cap is reached or manually closed, the DAO marks the round as successful.
4. **Claim NFTs:** Users can claim their NFTs by burning their blind boxes if the round was successful.

### Token Swapping

The `PeridotSwap` contract facilitates the conversion between MiniNFTs, FFT tokens, and final NFTs, incorporating fee mechanisms to sustain the ecosystem.

**Swapping Scenarios:**

- **MiniNFT to FFT:** Users swap MiniNFTs for FFT tokens, incurring a fee that is directed to the vault.
- **FFT to MiniNFT:** Users swap FFT tokens back to MiniNFTs, with a tax applied.
- **MiniNFT to NFT:** Users convert MiniNFTs into final NFTs, subject to a tax on the MiniNFTs.
- **NFT to MiniNFT (DAO Only):** The DAO can convert final NFTs back into MiniNFTs.

### Fee Management

Fees are integral to the Peridot ecosystem, ensuring sustainable operations and funding.

**Fee Mechanisms:**

- **FFT Transfers:** A percentage fee (`fftTax`) is applied during FFT token transfers, directed to the vault.
- **NFT Swaps:** A smaller fee (`nftTax`) is applied when converting MiniNFTs to final NFTs.
- **DAO Control:** The DAO has the authority to update fee percentages through governance mechanisms.

---

## Event Logging

Events are emitted by smart contracts to log significant actions, enabling off-chain applications and monitoring tools to track contract activities.

### PeridotTokenFactory Events

- `CollectionPairCreated`: Emitted when a new MiniNFT and FFT pair is created for a project.

### PeridotFFT Events

- `SetPercent`: Emitted when the vault and pool funding vault fee percentages are updated.

### PeridotMiniNFT Events

- `StartNewRound`: Emitted when a new sale round is initiated.
- `CloseRound`: Emitted when a sale round is closed.
- `ClaimBlindBox`: Emitted when a user claims an NFT from a blind box.
- `WithdrawEther`: Emitted when Ether is withdrawn from the contract.
- `UpdateRoundSucceed`: Emitted when a sale round is marked as successful.
- `UpdateBlindBoxPrice`: Emitted when the blind box price is updated.

### PeridotSwap Events

- `UpdatePoolRelation`: Emitted when pool relations between contracts are updated.
- `PoolClaim`: Emitted when a user claims an NFT from a pool.
- `SwapMiniNFTtoFFT`: Emitted when a user swaps MiniNFTs to FFT tokens.
- `SwapFFTtoMiniNFT`: Emitted when a user swaps FFT tokens back to MiniNFTs.
- `SwapMiniNFTtoNFT`: Emitted when a user swaps MiniNFTs to final NFTs.
- `UpdateFactory`: Emitted when the factory address is updated.
- `UpdateTax`: Emitted when FFT and NFT tax percentages are updated.

---

## Security Considerations

Security is paramount in smart contract development. The Peridot Smart Contract Suite incorporates several mechanisms to ensure robust security:

- **Access Control:** Strict modifiers (`onlyOwner`, `onlyDAO`, `onlyFactoryOrOwner`) restrict sensitive functions to authorized entities.
- **Reentrancy Protection:** The `ReentrancyGuard` contract is inherited by `PeridotSwap` to prevent reentrancy attacks.
- **Safe Math Operations:** Leveraging OpenZeppelin's `SafeMath` library to prevent arithmetic overflows and underflows.
- **ERC Standards Compliance:** Adherence to ERC20 and ERC1155 standards ensures compatibility and security best practices.
- **Event Logging:** Comprehensive event emission facilitates monitoring and auditing of contract activities.

---

## Deployment

Deploying the Peridot Smart Contract Suite involves the following steps:

1. **Deploy the PeridotTokenFactory Contract:**
   - Initialize with DAO address, Swap address, Vault address, and Pool Funding Vault address.
   - **Example:**
     ```bash
     # Deployment script or commands for PeridotTokenFactory
     ```
2. **Deploy the PeridotSwap Contract:**
   - Ensure it knows the address of the PeridotTokenFactory.
   - Update factory relations as needed.
3. **Create Token Pairs:**
   - Use the `createCollectionPair` function of the factory to deploy `PeridotMiniNFT` and `PeridotFFT` contracts for each project.
   - **Example:**
     ```bash
     # Example commands to create a new token pair
     ```
4. **Initialize Pool Relations:**
   - Ensure that the PeridotSwap contract is aware of the new token pairs via `updatePoolRelation`.

---

## Usage

### Creating a Token Pair

1. **Factory Owner Action:**
   - Call `createCollectionPair` with the project address, salt, MiniNFT base URI, name, and symbol.
2. **Minting and Claiming NFTs:**
   - DAO initiates a new sale round using `startNewRound`.
   - Users purchase blind boxes via `mintBlindBox`.
   - DAO closes the round using `closeRound`.
   - DAO marks the round as successful using `updateRoundSucceed`.
   - Users claim their NFTs using `claimBlindBox`.

### Swapping Tokens

1. **Swapping MiniNFTs to FFT:**
   - Users call `swapMiniNFTtoFFT` on the `PeridotSwap` contract.
2. **Swapping FFT to MiniNFTs:**
   - Users call `swapFFTtoMiniNFT` on the `PeridotSwap` contract.
3. **Swapping MiniNFTs to Final NFTs:**
   - Users call `swapMiniNFTtoNFT` on the `PeridotSwap` contract.
4. **DAO Swaps Final NFT to MiniNFT:**
   - DAO calls `swapNFTtoMiniNFT` on the `PeridotSwap` contract.

---

## Conclusion

The Peridot Smart Contract Suite offers a sophisticated framework for managing fundraising, token issuance, NFT minting, and swapping within a decentralized ecosystem. By leveraging well-established standards like ERC20 and ERC1155, and integrating secure practices such as access control and reentrancy guards, Peridot ensures both functionality and security. Whether you're a developer looking to integrate with Peridot or an investor participating in its ecosystem, this suite provides a reliable and scalable foundation.

For further inquiries, contributions, or support, please refer to the Peridot Documentation or contact the Peridot development team.

---

## Disclaimer

This README is for informational purposes only. It does not constitute financial advice. Deploying and interacting with smart contracts carries inherent risks. Always conduct thorough research and consult with a professional before making financial decisions.
