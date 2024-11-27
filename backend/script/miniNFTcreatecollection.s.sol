// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/PeridotFlat.sol";

contract SetPeridotFactory is Script {
    address constant miniNFT = 0x85CF4979d4f38fb3Ae454aeDfDe4408508611f83;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotMiniNFT peridotMiniNFT = PeridotMiniNFT(payable(miniNFT));

        console.log("Attempting to start new Round...");
        try peridotMiniNFT.startNewRound(100) {
            console.log("Round started successfully!");
        } catch Error(string memory reason) {
            console.log("Failed to start Round:", reason);
        }

        vm.stopBroadcast();
    }
}
