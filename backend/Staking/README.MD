# Peridot Staking Protocol Documentation

Welcome to the Peridot Staking Protocol Documentation! This document provides a comprehensive overview of the staking contracts within the Peridot ecosystem, detailing their functionalities, interactions, and key components. The staking protocol allows users to stake Peridot tokens to earn rewards, enhancing user engagement and providing liquidity to the platform.

## Table of Contents

- [Introduction](#introduction)
- [Contracts Overview](#contracts-overview)
  - [PeridotBar](#peridotbar)
  - [PeridotBoost3](#peridotboost3)
- [Key Functionalities](#key-functionalities)
  - [Staking and Unstaking](#staking-and-unstaking)
  - [Reward Mechanism](#reward-mechanism)
- [Event Logging](#event-logging)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)
- [Usage](#usage)
- [Conclusion](#conclusion)
- [Disclaimer](#disclaimer)

---

## Introduction

The Peridot Staking Protocol is designed to incentivize users to stake their Peridot tokens, thereby providing liquidity and stability to the Peridot ecosystem. By staking Peridot, users receive xPeridot tokens, which represent their stake and entitle them to a share of the platform's earnings. The protocol comprises two primary contracts: `PeridotBar` and `PeridotBoost3`, each serving distinct roles in the staking mechanism.

---

## Contracts Overview

### PeridotBar

**File Path:** `Staking/contracts/PeridotBar.sol`

The `PeridotBar` contract allows users to stake Peridot tokens and receive xPeridot tokens in return. Holding xPeridot tokens entitles users to a portion of the platform's swap earnings, effectively earning rewards based on their staked amount.

#### Key Features:

- **Staking Mechanism:** Users can stake Peridot tokens to receive xPeridot tokens.
- **Reward Distribution:** xPeridot tokens appreciate in value as the platform earns, providing passive rewards to stakers.
- **Minting and Burning:** The contract handles the minting of xPeridot tokens when users stake and burning when they unstake.
- **Ratio-Based Rewards:** The minting of xPeridot is based on the existing supply and total staked Peridot, ensuring proportional rewards.

#### Important Functions:

```markdown
#### `enterPool(uint256 _amount)`

Allows users to stake a specified amount of Peridot tokens and receive xPeridot tokens based on the current staking ratio.

- **Parameters:**
  - `_amount`: The amount of Peridot tokens to stake.
- **Behavior:**
  - Calculates the total Peridot locked in the contract and the total xPeridot supply.
  - If no xPeridot exists, mints xPeridot 1:1 with the staked amount.
  - Otherwise, mints xPeridot based on the ratio of total xPeridot to total Peridot.
  - Transfers the staked Peridot tokens from the user to the contract.

#### `leavePool(uint256 _share)`

Enables users to unstake their xPeridot tokens, receiving their proportional share of Peridot tokens plus any accumulated rewards.

- **Parameters:**
  - `_share`: The amount of xPeridot tokens to burn.
- **Behavior:**
  - Calculates the corresponding Peridot value based on the total xPeridot supply.
  - Burns the specified xPeridot from the user's balance.
  - Transfers the calculated Peridot amount back to the user.
```

---

### PeridotBoost3

File Path: `Staking/contracts/PeridotBoost3.sol`

The `PeridotBoost3` contract enhances the staking experience by introducing additional features such as reward multipliers based on the locking period and integration with external contracts like MasterChef for yield optimization.

#### Key Features:

- **Enhanced Staking**:
  - Users can stake with different locking periods, each offering varying reward multipliers.
  - Reward Multipliers: Multiplier boosts are applied based on the length of the staking period, incentivizing longer-term staking.
  - Integration with MasterChef: Leverages external yield farming strategies to optimize rewards for stakers.
  - Ownership Management: Utilizes ownership controls to manage contract administration securely.
  - Reentrancy Protections: : Incorporates `ReentrancyGuard` to prevent reentrancy attacks during staking operations.

#### Important Functions:

#### `stake(uint256 _amount, uint256 _lockingPeriod)`

Allows users to stake a specified amount of Peridot tokens with a chosen locking period, applying the corresponding reward multiplier.

- **Parameters:**
  - `_amount`: The amount of Peridot tokens to stake.
  - `_lockingPeriod`: The duration (in days) for which the tokens will be locked (e.g., 30, 90, 180 days).
- **Behavior:**
  - Validates that the staking amount is greater than zero.
  - Ensures the locking period is one of the allowed durations (30, 90, 180 days).
  - Transfers the specified amount of Peridot tokens from the user to the contract.
  - Calculates the reward multiplier based on the locking period.
  - Mints xPeridot tokens to the user based on the staking amount and multiplier.
  - Records the staking details in the `stakers` mapping.
  - Emits a `Staked` event.

#### `unstake(uint256 _amount)`

Enables users to unstake their tokens after the locking period has elapsed, returning their staked Peridot tokens along with any accumulated rewards.

- **Parameters:**
  - `_amount`: The amount of xPeridot tokens to burn and unstake.
- **Behavior:**
  - Retrieves the staking details from the `stakers` mapping.
  - Checks if the locking period has been completed.
  - Ensures the user is not unstaking more than they have staked.
  - Burns the xPeridot tokens from the user's balance.
  - Transfers the corresponding amount of Peridot tokens back to the user.
  - Updates or clears the user's staking details.
  - Emits an `Unstaked` event.

#### `getMultiplier(uint256 _lockingPeriod) public pure returns (uint256)`

Calculates the reward multiplier based on the selected locking period, enhancing the rewards for longer staking durations.

- **Parameters:**
  - `_lockingPeriod`: The duration (in days) for which the tokens are locked.
- **Returns:**

  - `uint256`: The multiplier value corresponding to the locking period.

- **Behavior:**
  - Returns a multiplier based on predefined locking periods:
    - 30 days: 100%
    - 90 days: 120%
    - 180 days: 150%
  - Returns `0` for invalid locking periods.

#### Additional Functions and Features:

#### Ownership Management Functions

The `PeridotBoost3` contract leverages OpenZeppelin's `Ownable` contract for secure ownership management, allowing only the owner to perform administrative tasks.

---

## Key Functionalities

### Staking and Unstaking

**Staking (`enterPool` and `stake` Functions):**

Users can stake their Peridot tokens by calling the `enterPool` function in the `PeridotBar` contract or the `stake` function in the `PeridotBoost3` contract. Upon staking, xPeridot tokens are minted and distributed to the user based on the staking ratio or selected multiplier.

- **PeridotBar (`enterPool`):**
  - Stakes Peridot and mints xPeridot based on the current ratio of total xPeridot to total staked Peridot.
- **PeridotBoost3 (`stake`):**
  - Stakes Peridot with a locking period, applying a reward multiplier to increase the amount of xPeridot minted.

**Unstaking (`leavePool` and `unstake` Functions):**

To retrieve their staked Peridot tokens, users can call the `leavePool` function in `PeridotBar` or the `unstake` function in `PeridotBoost3`. This process burns the user's xPeridot tokens and transfers back the proportional amount of Peridot tokens along with any earned rewards.

- **PeridotBar (`leavePool`):**
  - Burns xPeridot and returns Peridot plus rewards based on the current stake ratio.
- **PeridotBoost3 (`unstake`):**
  - Burns xPeridot multiplied by the reward multiplier and returns the staked Peridot after the locking period.

### Reward Mechanism

The staking rewards are distributed through the appreciation of xPeridot tokens. As the platform generates earnings (e.g., from swaps), the total Peridot held by the contract increases, thereby increasing the value of each xPeridot token. In `PeridotBoost3`, additional reward multipliers based on locking periods further enhance the user's earnings.

- **PeridotBar:**
  - Rewards are indirectly provided by the increase in the value of xPeridot relative to staked Peridot.
- **PeridotBoost3:**
  - Additional multipliers based on locking periods provide higher returns for longer commitments.

---

## Event Logging

Both contracts emit events to facilitate transparency and enable off-chain services to track staking activities.

### PeridotBar Events

- **Staked:** Emitted when a user stakes Peridot tokens.

  ```solidity
  event Staked(address indexed user, uint256 amount, uint256 lockingPeriod);
  ```

- **Unstaked:** Emitted when a user unstakes their tokens.
  ```solidity
  event Unstaked(address indexed user, uint256 amount);
  ```

### PeridotBoost3 Events

- **Staked:** Emitted when a user stakes Peridot tokens with a locking period.

  ```solidity
  event Staked(address indexed user, uint256 amount, uint256 lockingPeriod);
  ```

- **Unstaked:** Emitted when a user unstakes their tokens.
  ```solidity
  event Unstaked(address indexed user, uint256 amount);
  ```

---

## Security Considerations

Security is paramount in the Peridot Staking Protocol. The following measures are implemented to ensure the protocol's integrity:

- **Reentrancy Guards:** Both contracts utilize `ReentrancyGuard` to prevent reentrancy attacks during staking and unstaking operations.
- **Access Control:** Critical functions are restricted to be callable only by authorized entities, typically the contract owner, using the `Ownable` modifier.
- **SafeMath and SafeERC20:** Arithmetic operations are performed using the `SafeMath` library to prevent overflow and underflow vulnerabilities. `SafeERC20` ensures safe interactions with ERC20 tokens.
- **Input Validation:** Functions validate inputs such as staking amounts and locking periods to prevent misuse or unintended behavior.
- **Upgradeable Contracts:** `PeridotBoost3` is designed to be upgradeable using the UUPS (Universal Upgradeable Proxy Standard) pattern, ensuring future enhancements can be securely integrated without compromising the existing state.
- **Ownership Renouncement:** The `renounceOwnership` function allows the owner to relinquish control, removing access to `onlyOwner` functions and decentralizing control.

---

## Deployment

Deploying the Peridot Staking Protocol involves deploying both `PeridotBar` and `PeridotBoost3` contracts, ensuring proper initialization and integration with the PeridotToken. Below is a high-level deployment guide:

1. **Prerequisites:**

   - Install [Hardhat](https://hardhat.org/) or a similar Ethereum development environment.
   - Ensure you have access to the PeridotToken contract address.

2. **Compilation:**

   ```bash
   npx hardhat compile
   ```

3. **Deploy `PeridotBar` Contract:**

   - Initialize with the PeridotToken contract address.
   - Example Deployment Script:
     ```javascript
     const PeridotBar = await ethers.getContractFactory("PeridotBar");
     const peridotBar = await PeridotBar.deploy(peridotTokenAddress);
     await peridotBar.deployed();
     console.log("PeridotBar deployed to:", peridotBar.address);
     ```

4. **Deploy `PeridotBoost3` Contract:**

   - Initialize with the PeridotToken contract address.
   - Example Deployment Script:
     ```javascript
     const PeridotBoost3 = await ethers.getContractFactory("PeridotBoost3");
     const peridotBoost3 = await PeridotBoost3.deploy(peridotTokenAddress);
     await peridotBoost3.deployed();
     console.log("PeridotBoost3 deployed to:", peridotBoost3.address);
     ```

5. **Verification:**

   - Verify the contracts on your chosen blockchain explorer (e.g., Cronoscan) to enhance transparency and trust.

6. **Integration:**
   - Ensure that both contracts are aware of each other if necessary and configure any external integrations, such as with MasterChef or other yield farming strategies.

---

## Usage

### Staking Peridot Tokens

#### 1. **Approve Tokens:**

Before staking, approve the staking contract to spend your Peridot tokens.

```solidity
peridotToken.approve(stakingContractAddress, amount);
```

#### 2. **Stake Tokens:**

Call the `enterPool` or `stake` function with the desired amount and locking period.

```solidity
stakingContract.enterPool(amount);
// or for PeridotBoost3
stakingContract.stake(amount, lockingPeriod);
```

- **PeridotBar (`enterPool`):**
  - Stakes Peridot and mints xPeridot based on the current ratio.
- **PeridotBoost3 (`stake`):**
  - Stakes Peridot with a locking period, applying a reward multiplier for enhanced returns.

#### 3. **Receive xPeridot:**

Upon successful staking, xPeridot tokens are minted and credited to your wallet.

### Unstaking Peridot Tokens

#### 1. **Unstake xPeridot:**

Call the `leavePool` or `unstake` function with the amount of xPeridot you wish to redeem.

```solidity
stakingContract.leavePool(xPeridotAmount);
// or for PeridotBoost3
stakingContract.unstake(xPeridotAmount);
```

- **PeridotBar (`leavePool`):**
  - Burns xPeridot and returns Peridot plus rewards based on the current stake ratio.
- **PeridotBoost3 (`unstake`):**
  - Burns xPeridot multiplied by the reward multiplier and returns the staked Peridot after the locking period.

#### 2. **Receive Peridot:**

After the locking period (if applicable), your staked Peridot tokens and any rewards are transferred back to your wallet.

### Managing Ownership

#### 1. **Transfer Ownership:**

The contract owner can transfer ownership to a new address.

```solidity
stakingContract.transferOwnership(newOwnerAddress);
```

#### 2. **Renounce Ownership:**

The owner can renounce ownership, removing the ability to perform `onlyOwner` functions.

```solidity
stakingContract.renounceOwnership();
```

**Note:** Renouncing ownership is irreversible and should only be done if you're certain no further administrative actions are required.

---

## Conclusion

The Peridot Staking Protocol offers a robust and secure mechanism for users to stake their Peridot tokens and earn rewards. By leveraging well-established standards and security practices, the protocol ensures both functionality and safety. Whether you're looking to earn passive income or contribute to the platform's liquidity, the Peridot Staking Protocol provides the necessary tools and infrastructure to facilitate these interactions seamlessly.

For further information, support, or contributions, please refer to the [Peridot Documentation](#) or contact the development team directly.

---

## Disclaimer

This documentation is for informational purposes only and does not constitute financial or investment advice. Deploying and interacting with smart contracts involves risks, including the potential loss of funds. Users should conduct their own research and consult with financial professionals before engaging with the Peridot Staking Protocol.
