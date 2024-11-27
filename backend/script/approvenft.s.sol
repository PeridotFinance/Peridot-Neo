// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/member/PeridotMemberNFT.sol";

contract SetPeridotFactory is Script {
    address constant nft = 0xF4a6850Ab0e9a149979A77aF009635b759c5Ab14;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotMemberNFT peridotMemberNFT = PeridotMemberNFT(nft);

        console.log("Attempting to start new Round...");
        try
            peridotMemberNFT.setApprovalForAll(
                0xa3060e2528c12be561d2cB000cf171A8a10032AB,
                true
            )
        {
            console.log("Round started successfully!");
        } catch Error(string memory reason) {
            console.log("Failed to start Round:", reason);
        }

        vm.stopBroadcast();
    }
}
