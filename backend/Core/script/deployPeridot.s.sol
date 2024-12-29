// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotSwap, PeridotTokenFactory} from "../src/PeridotFlat.sol";

contract DeployPeridotSwap is Script {
    address constant daoAddress = 0xCED23360932B80d18fdEAEAa573202E80A584804;
    address constant vaultAddress = 0x49b7e0B48980059Bd7eaF1E0987F6ad73f6285e4;
    address constant pFvaultAddress =
        0x49b7e0B48980059Bd7eaF1E0987F6ad73f6285e4;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_MAIN");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WitnetRandomness address
        PeridotSwap peridotSwap = new PeridotSwap();
        console.log("PeridotSwap deployed to:", address(peridotSwap));

        PeridotTokenFactory peridotTokenFactory = new PeridotTokenFactory(
            daoAddress,
            address(peridotSwap),
            vaultAddress,
            pFvaultAddress
        );
        console.log(
            "PeridotTokenFactory deployed to:",
            address(peridotTokenFactory)
        );

        peridotSwap.updateFactory(address(peridotTokenFactory));

        vm.stopBroadcast();
    }
}
