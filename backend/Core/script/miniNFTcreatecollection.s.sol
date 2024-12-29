// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotMiniNFT} from "../src/PeridotFlat.sol";

contract SetPeridotFactory is Script {
    address constant miniNFT = 0xfF8151C55A3AFfED7BEccfc379bF9b22d68b61f8;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotMiniNFT peridotMiniNFT = PeridotMiniNFT(payable(miniNFT));

        console.log("Attempting to start new Round...");
        try peridotMiniNFT.startNewRound(10000) {
            console.log("Round started successfully!");
        } catch Error(string memory reason) {
            console.log("Failed to start Round:", reason);
        }

        vm.stopBroadcast();
    }
}
