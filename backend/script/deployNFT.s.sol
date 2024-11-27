// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import "../src/member/PeridotMemberNFT.sol";

contract DeployNFT is Script {
    address constant owner = 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WitnetRandomness address
        PeridotMemberNFT peridotMemberNFT = new PeridotMemberNFT();
        console.log("PeridotMemberNFT deployed to:", address(peridotMemberNFT));

        peridotMemberNFT.safeMint(address(owner));

        vm.stopBroadcast();
    }
}
