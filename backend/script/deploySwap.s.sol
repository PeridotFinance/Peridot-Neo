// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotSwap} from "../src/PeridotFlat.sol";

contract DeployPeridotSwap is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_MAIN");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WitnetRandomness address
        PeridotSwap peridotSwap = new PeridotSwap();
        console.log("PeridotSwap deployed to:", address(peridotSwap));

        vm.stopBroadcast();
    }
}
