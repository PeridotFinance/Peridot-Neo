# Peridot Lend & Borrow Protocol Documentation

Welcome to the Peridot Lend & Borrow Protocol Documentation! This document provides an extensive overview of the Lend & Borrow contracts, their functionalities, and their interactions within the Peridot ecosystem. The protocol facilitates decentralized lending and borrowing of assets, ensuring security, efficiency, and user accessibility.

## Table of Contents

- [Introduction](#introduction)
- [Contracts Overview](#contracts-overview)
  - [CToken Contracts (CErc20 & CEther)](#ctoken-contracts-cerc20--cether)
  - [Peridotroller](#peridotroller)
  - [InterestRateModel](#interestratemodel)
  - [ErrorReporter](#errorreporter)
  - [SimplePriceOracle](#simplepriceoracle)
- [Supporting Libraries and Interfaces](#supporting-libraries-and-interfaces)
- [Key Functionalities](#key-functionalities)
  - [Minting](#minting)
  - [Redeeming](#redeeming)
  - [Borrowing](#borrowing)
  - [Repaying Borrows](#repaying-borrows)
  - [Liquidation](#liquidation)
- [Event Logging](#event-logging)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)
- [Usage](#usage)
- [Conclusion](#conclusion)
- [Disclaimer](#disclaimer)

---

## Introduction

The Peridot Lend & Borrow Protocol is a decentralized finance (DeFi) platform that allows users to lend and borrow a variety of assets in a secure and transparent manner. By leveraging smart contracts, the protocol ensures that transactions are trustless, automated, and immutable once deployed. Users can supply assets to earn interest, borrow against their collateral, and engage in various financial operations with confidence in the system's integrity.

---

## Contracts Overview

The core of the Peridot Lend & Borrow Protocol consists of several interconnected smart contracts. Each contract has a specific role, ensuring the smooth operation of lending, borrowing, and risk management within the ecosystem.

### CToken Contracts (CErc20 & CEther)

**File Path:** `LendBorrow/contracts/Flattened.sol`

The `CToken` contracts are fundamental to the protocol, representing the lending markets for various assets. They comply with the EIP-20 standard, making them interoperable with other ERC-20 compatible platforms and wallets.

There are two primary types of `CToken` contracts:

- **CErc20:** Wraps an ERC-20 compatible underlying asset.
- **CEther:** Wraps Ether (ETH) as the underlying asset.

**Key Features:**

- **Interest Accrual:** As users supply assets to the protocol, interest is accrued based on the current supply and borrow rates.
- **Collateralization:** Supplied assets can be used as collateral for borrowing other assets.
- **Liquidity Tracking:** Tracks total supply, total borrows, and reserves within each market.

**Important Functions:**

- `mint(uint mintAmount)`: Allows users to supply assets to the protocol and receive equivalent `CToken` tokens.
- `redeem(uint redeemTokens)`: Enables users to redeem their `CToken` tokens for the underlying asset.
- `redeemUnderlying(uint redeemAmount)`: Allows users to redeem a specific amount of the underlying asset.
- `borrow(uint borrowAmount)`: Lets users borrow assets from the protocol using their supplied assets as collateral.
- `repayBorrow(uint repayAmount)`: Enables users to repay their borrowed assets.
- `liquidateBorrow(address borrower, uint repayAmount, address cTokenCollateral)`: Allows third parties to liquidate borrowers who have insufficient collateral.

**Modifiers & Access Control:**

- **Non-reentrant:** Prevents reentrancy attacks on functions that modify state.
- **OnlyOwner:** Restricts certain administrative functions to the contract owner.

---

### Peridotroller

**File Path:** `LendBorrow/contracts/Flattened.sol`

The `Peridotroller` contract serves as the risk management layer of the protocol. It oversees the interactions between users and the `CToken` markets, ensuring that each operation complies with predefined risk parameters.

**Key Features:**

- **Market Listings:** Determines which assets are supported and can be interacted with within the protocol.
- **Collateral Factors:** Sets collateralization limits for each asset, dictating how much a user can borrow against their supplied assets.
- **Liquidity Calculations:** Evaluates users' liquidity to determine borrowing capacity and eligibility for liquidation.
- **Policy Hooks:** Integrates with `CToken` contracts to enforce protocol rules during lending and borrowing operations.

**Important Functions:**

- `enterMarkets(address[] calldata cTokens)`: Allows users to designate which markets their supplied assets will be used as collateral.
- `exitMarket(address cToken)`: Enables users to remove an asset from their collateral list.
- `mintAllowed(...)`: Checks if a mint operation complies with protocol rules.
- `borrowAllowed(...)`: Validates borrowing requests against a user's collateral and the market's liquidity.
- `liquidateBorrowAllowed(...)`: Determines if a liquidation operation is permissible.

**Modifiers & Access Control:**

- **OnlyOwner:** Grants the owner (typically the governance contract) the authority to perform administrative tasks.
- **None:** Most functions are externally accessible but enforce rules through internal checks.

---

### InterestRateModel

**File Path:** `LendBorrow/contracts/Flattened.sol`

The `InterestRateModel` is an abstract contract that defines how interest rates are calculated within the lending markets. Different implementations can customize the interest rate logic to respond to varying market conditions.

**Key Features:**

- **Dynamic Rates:** Calculates borrow and supply rates based on market utilization and predefined parameters.
- **Adjustability:** Certain models allow for parameter updates to adapt to changing economic environments.

**Important Functions:**

- `getBorrowRate(uint cash, uint borrows, uint reserves)`: Calculates the current borrow interest rate per block.
- `getSupplyRate(uint cash, uint borrows, uint reserves, uint reserveFactorMantissa)`: Determines the supply interest rate per block based on the borrow rate and reserves.

**Modifiers & Access Control:**

- **Virtual:** Allows derived contracts to override and implement specific interest rate algorithms.

---

### ErrorReporter

**File Path:** `LendBorrow/contracts/Flattened.sol`

The `ErrorReporter` contract standardizes error handling across the protocol. By defining enums for possible errors and failure scenarios, it ensures consistent and informative error reporting.

**Key Features:**

- **Error Enumeration:** Lists all possible errors (`Error`) and detailed failure scenarios (`FailureInfo`).
- **Event Logging:** Emits events upon encountering errors, aiding in debugging and monitoring.
- **Fallback Mechanisms:** Differentiates between known errors and opaque errors from external contracts.

**Important Functions:**

- `fail(Error err, FailureInfo info)`: Logs and returns a standardized error code.
- `failOpaque(Error err, FailureInfo info, uint opaqueError)`: Handles and logs external contract errors separately.

**Modifiers & Access Control:**

- **Internal Functions:** Designed to be called within the protocol's contracts to report errors.

---

### SimplePriceOracle

**File Path:** `LendBorrow/contracts/Flattened.sol`

The `SimplePriceOracle` provides asset price data to the `Peridotroller`. It allows manual setting of asset prices, ensuring that the protocol has up-to-date and accurate information for risk assessments.

**Key Features:**

- **Manual Price Setting:** Prices are inputted by authorized entities, typically through governance actions.
- **Price Retrieval:** Ensures that all supported assets have an associated price in the protocol.

**Important Functions:**

- `setUnderlyingPrice(CToken cToken, uint underlyingPriceMantissa)`: Assigns a price to a specific asset.
- `setDirectPrice(address asset, uint price)`: Directly sets the price for an asset without associating it with a `CToken`.
- `getUnderlyingPrice(CToken cToken)`: Retrieves the current price of the underlying asset for a `CToken`.
- `_getUnderlyingAddress(CToken cToken)`: Internal function to obtain the underlying asset's address.

**Modifiers & Access Control:**

- **OnlyOwner:** Restricts price-setting functions to the contract owner or governance.
- **None:** Price retrieval functions are publicly accessible.

---

## Supporting Libraries and Interfaces

### OpenZeppelin Contracts

The protocol leverages a suite of standardized contracts from OpenZeppelin, ensuring security and adherence to best practices. Key utilized contracts include:

- `Context`: Provides information about the execution context.
- `Ownable`: Implements ownership and access control mechanisms.
- `IERC165`, `IERC1155`, `IERC20`: Define standard interfaces for contract interoperability.
- `Address`: Offers utility functions related to address type operations.

### Create2

**File Path:** `@openzeppelin/contracts/utils/Create2.sol`

The `Create2` library facilitates deterministic contract deployments, allowing the calculation of a contract's address prior to deployment. This is crucial for the factory pattern employed in the protocol.

---

## Key Functionalities

### Minting

Users can supply assets to the protocol, minting `CToken` tokens that represent their stake in the lending market. Minting increases the user's collateral, enabling them to borrow against it.

**Process:**

1. **Approval:** Users must approve the `CToken` contract to transfer their assets.
2. **Mint Call:** Users invoke the `mint` function with the desired amount.
3. **Receive CToken:** Upon successful minting, users receive `CToken` tokens proportional to their deposit.

### Redeeming

Users can redeem their `CToken` tokens to withdraw the underlying asset from the protocol. This process decreases their collateral, potentially affecting their borrowing capacity.

**Process:**

1. **Redeem Call:** Users call the `redeem` function specifying the amount of `CToken` to convert.
2. **Receive Asset:** The protocol transfers the equivalent underlying asset to the user based on the current exchange rate.

### Borrowing

Users can borrow assets from the protocol by leveraging their supplied collateral. The amount they can borrow is determined by their collateral's value and the associated collateral factors.

**Process:**

1. **Ensure Collateral:** Users must have sufficient collateral in the protocol.
2. **Borrow Call:** Users invoke the `borrow` function specifying the desired borrow amount.
3. **Receive Borrowed Asset:** The protocol transfers the borrowed asset to the user, and their borrow balance increases accordingly.

### Repaying Borrows

Borrowers can repay their outstanding debts to the protocol, reducing their borrow balances and freeing up borrowing capacity.

**Process:**

1. **Approval (for CErc20):** Users must approve the `CToken` contract to transfer their repayment assets.
2. **Repay Call:** Users call `repayBorrow` or `repayBorrowBehalf` with the repayment amount.
3. **Debt Reduction:** The protocol reduces the user's borrow balance by the repaid amount.

### Liquidation

When a user's borrow position becomes undercollateralized, third parties can liquidate their position by repaying part of their debt in exchange for a discounted amount of their collateral.

**Process:**

1. **Identify Undercollateralized Borrower:** The `Peridotroller` flags borrowers with insufficient collateral.
2. **Liquidate Call:** A liquidator calls `liquidateBorrow`, specifying the borrower, repay amount, and collateral `CToken`.
3. **Seize Collateral:** The protocol transfers a portion of the borrower's collateral to the liquidator at a discounted rate.

---

## Event Logging

Events are emitted by contracts to provide transparency and facilitate off-chain monitoring of protocol activities. Key events include:

### CToken Events

- `AccrueInterest(uint cashPrior, uint interestAccumulated, uint borrowIndex, uint totalBorrows)`: Logs interest accruals.
- `Mint(address minter, uint mintAmount, uint mintTokens)`: Logs minting actions.
- `Redeem(address redeemer, uint redeemAmount, uint redeemTokens)`: Logs redemption actions.
- `Borrow(address borrower, uint borrowAmount, uint accountBorrows, uint totalBorrows)`: Logs borrow actions.
- `RepayBorrow(address payer, address borrower, uint repayAmount, uint accountBorrows, uint totalBorrows)`: Logs repayments.
- `LiquidateBorrow(address liquidator, address borrower, uint repayAmount, address cTokenCollateral, uint seizeTokens)`: Logs liquidations.

### Peridotroller Events

- `Failure(uint error, uint info, uint detail)`: Logs failures and errors encountered during operations.

### SimplePriceOracle Events

- No specific events, but state changes are tracked through function calls.

---

## Security Considerations

Security is paramount in the Peridot Lend & Borrow Protocol. The following measures are implemented to ensure the protocol's integrity:

- **Access Control:** Only authorized entities (e.g., contract owners, DAO) can perform sensitive operations.
- **Reentrancy Guards:** Prevents reentrant calls to critical functions, safeguarding against reentrancy attacks.
- **Safe Math Operations:** Utilizes Solidity's built-in overflow checks and OpenZeppelin's libraries to prevent arithmetic errors.
- **Price Oracle Integrity:** Ensures that asset prices are accurately and securely reported to prevent manipulation.
- **Event Auditing:** Comprehensive event logging allows for real-time monitoring and auditing of contract activities.

---

## Deployment

Deploying the Peridot Lend & Borrow Protocol involves deploying each contract in the correct order and ensuring proper initialization. Below is a high-level deployment guide:

1. **Deploy the InterestRateModel Contract:**

   - Initialize with desired parameters for base rate, multiplier, jump multiplier, and kink.

2. **Deploy the Peridotroller Contract:**

   - Initialize with the address of the newly deployed `InterestRateModel`.

3. **Deploy CToken Contracts (CErc20 & CEther):**

   - For each asset, deploy a `CErc20` contract (for ERC-20 assets) or `CEther` (for Ether).
   - Initialize each `CToken` with the `Peridotroller` address, `InterestRateModel` address, reserve factor, and initial exchange rate.

4. **Deploy the SimplePriceOracle Contract:**

   - Initialize and set asset prices using `setUnderlyingPrice` or `setDirectPrice`.

5. **Register Markets in Peridotroller:**

   - For each `CToken`, register it as a market in the `Peridotroller`.
   - Set collateral factors for each market.

6. **Finalize Deployment:**
   - Set the owner addresses and ensure all permissions are correctly assigned.
   - Perform initial fund allocations if necessary.

**Note:** Ensure that all deployments are performed on the intended network (e.g., Ethereum Mainnet, Testnets) and that proper security audits are conducted before moving to production.

---

## Usage

### Supplying Assets (Minting)

1. **Approve CToken Contract (for CErc20):**

   - Users must approve the `CErc20` contract to transfer their ERC-20 tokens.
   - Example:
     ```solidity
     IERC20(underlying).approve(cTokenAddress, mintAmount);
     ```

2. **Mint CToken:**
   - Call the `mint` function on the `CToken` contract with the desired supply amount.
   - Example:
     ```solidity
     uint mintResult = cToken.mint(mintAmount);
     require(mintResult == 0, "Mint failed");
     ```

### Withdrawing Assets (Redeeming)

1. **Redeem CToken:**
   - Users can redeem their `CToken` tokens for the underlying asset either by specifying the number of `CToken` or the amount of underlying to redeem.
   - Example:
     ```solidity
     uint redeemResult = cToken.redeem(redeemTokens);
     require(redeemResult == 0, "Redeem failed");
     ```

### Borrowing Assets

1. **Ensure Sufficient Collateral:**

   - Users must have supplied assets and entered markets to borrow against their collateral.

2. **Borrow Funds:**
   - Call the `borrow` function on the desired `CToken` contract.
   - Example:
     ```solidity
     uint borrowResult = cToken.borrow(borrowAmount);
     require(borrowResult == 0, "Borrow failed");
     ```

### Repaying Borrows

1. **Approve CToken Contract (for CErc20):**

   - Users must approve the `CErc20` contract to transfer their repayment tokens.
   - Example:
     ```solidity
     IERC20(underlying).approve(cTokenAddress, repayAmount);
     ```

2. **Repay Borrow:**
   - Call the `repayBorrow` function on the `CToken` contract.
   - Example:
     ```solidity
     uint repayResult = cToken.repayBorrow(repayAmount);
     require(repayResult == 0, "Repay failed");
     ```

### Liquidation

1. **Identify Underwater Borrowers:**

   - The `Peridotroller` flags borrowers with insufficient collateral.

2. **Liquidate Borrow:**
   - A liquidator calls the `liquidateBorrow` function on the `CToken` contract, specifying the borrower, repay amount, and collateral market.
   - Example:
     ```solidity
     uint liquidateResult = cToken.liquidateBorrow(borrower, repayAmount, cTokenCollateral);
     require(liquidateResult == 0, "Liquidation failed");
     ```

---

## Conclusion

The Peridot Lend & Borrow Protocol offers a comprehensive and secure platform for decentralized lending and borrowing. By adhering to established standards and integrating robust security measures, the protocol ensures reliable and transparent financial operations. Whether you are a lender aiming to earn interest or a borrower seeking assets against your collateral, Peridot provides the necessary tools and infrastructure to facilitate these interactions seamlessly.

For further information, support, or contributions, please refer to the [Peridot Documentation](#) or contact the development team directly.

---

## Disclaimer

This documentation is provided for informational purposes only and does not constitute financial or investment advice. Deploying and interacting with smart contracts involves risks, including the potential loss of funds. Users should conduct their own research and consult with financial professionals before engaging with the Peridot Lend & Borrow Protocol. The Peridot Lend & Borrow Protocol is based on the Compound Protocol.
