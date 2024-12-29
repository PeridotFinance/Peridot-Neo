// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/fundraising/PeridotTokenFactory.sol";

contract DeployPeridotSwap is Script {
    address constant daoAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant vaultAddress = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant pFvaultAddress =
        0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;
    address constant swapAddress = 0xa3060e2528c12be561d2cB000cf171A8a10032AB;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        PeridotTokenFactory peridotTokenFactory = new PeridotTokenFactory(
            daoAddress,
            swapAddress,
            vaultAddress,
            pFvaultAddress
        );
        console.log(
            "PeridotTokenFactory deployed to:",
            address(peridotTokenFactory)
        );

        vm.stopBroadcast();
    }
}
