// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";

contract EIP1967Proxy is Proxy {
    // Storage slot for the implementation address following EIP-1967 standard
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x88a09d348502fa1217a6f37d8bdd5bd0379d7eb8cb1f3220f8da56c8a756977f;

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor(address _logic) {
        require(_logic != address(0), "Logic contract address cannot be zero");
        _setImplementation(_logic);
        admin = msg.sender;
    }

    function _implementation() internal view override returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    function _setImplementation(address newImplementation) private {
        require(
            newImplementation != address(0),
            "Implementation cannot be zero address"
        );
        StorageSlot
            .getAddressSlot(_IMPLEMENTATION_SLOT)
            .value = newImplementation;
    }

    function upgradeTo(address newImplementation) external onlyAdmin {
        _setImplementation(newImplementation);
    }

    function addAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Admin cannot be zero address");
        admin = newAdmin;
    }
}
