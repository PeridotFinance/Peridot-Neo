// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/fundraising/PeridotMiniNFT.sol";

contract MintBlindBoxes is Script {
    // Replace with your actual PeridotMiniNFT contract address
    address constant miniNFT = 0x85CF4979d4f38fb3Ae454aeDfDe4408508611f83;

    // Price per blind box in wei (100 wei)
    uint256 constant BLIND_BOX_PRICE = 100 wei;

    // Number of blind boxes to mint (1,000)
    uint256 constant BOX_AMOUNT = 1000;

    function run() external {
        // Retrieve the deployer's private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");

        // Start broadcasting transactions using the deployer's private key
        vm.startBroadcast(deployerPrivateKey);

        // Initialize the PeridotMiniNFT contract instance
        PeridotMiniNFT peridotMiniNFT = PeridotMiniNFT(payable(miniNFT));

        // Calculate the total Ether required for minting
        //uint256 totalPrice = 0.0000000000001;

        console.log("Attempting to mint blind boxes...");

        try
            peridotMiniNFT.mintBlindBox{value: 0.0000000000001 ether}(
                BOX_AMOUNT
            )
        {
            console.log("Successfully minted 1,000 blind boxes!");
        } catch Error(string memory reason) {
            console.log("Failed to mint blind boxes:", reason);
        }

        console.log(
            "Minting 1,000 blind boxes completed. Attemptiong to close round..."
        );

        try peridotMiniNFT.closeRound() {
            console.log("Successfully closed round!");
        } catch Error(string memory reason) {
            console.log("Failed to close round:", reason);
        }

        console.log("Attempting to update Round...");
        try peridotMiniNFT.updateRoundSucceed(1) {
            console.log("Round updated successfully!");
        } catch Error(string memory reason) {
            console.log("Failed to update Round:", reason);
        }

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
