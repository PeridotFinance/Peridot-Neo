// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {PeridotTokenFactory} from "../src/PeridotFlat.sol";
import {PeridotMiniNFT} from "../src/PeridotFlat.sol";

contract SetPeridotFactory is Script {
    address constant projectAddress =
        0xF4a6850Ab0e9a149979A77aF009635b759c5Ab14;
    address constant tokenFactory = 0x9534999e1Ee168175103136dC1760F87198a8a79;
    bytes32 constant salt = keccak256(abi.encodePacked("Peridot GoldBar"));
    string constant miniNFTBaseUri =
        "ipfs://bafybeiadtdjbr6nd6ogtbjcy56oh2ymaxhw5djjdrl2zvhgngir2s3dqiq";
    string constant name = "Peridot GoldBar";
    string constant symbol = "pGOLD";

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TEST");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PeridotSwap with the WormholeRelayer address
        PeridotTokenFactory peridotTokenFactory = PeridotTokenFactory(
            payable(tokenFactory)
        );

        console.log("Attempting to create collection pair...");
        try
            peridotTokenFactory.createCollectionPair(
                address(projectAddress),
                bytes32(salt),
                "ipfs://bafybeiadtdjbr6nd6ogtbjcy56oh2ymaxhw5djjdrl2zvhgngir2s3dqiq",
                "Peridot GoldBar",
                "pGOLD"
            )
        {
            console.log("Collection pair created successfully!");
        } catch Error(string memory reason) {
            console.log("Failed to create collection pair:", reason);
        }

        address miniNFTAddress = peridotTokenFactory.projectToMiniNFT(
            projectAddress
        );
        console.log("MiniNFT address:", miniNFTAddress);

        address fftAddress = peridotTokenFactory.projectToFFT(projectAddress);
        console.log("FFT address:", fftAddress);

        vm.stopBroadcast();
    }
}
