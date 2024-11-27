const hre = require("hardhat");

async function main() {
  const inputString = "Peridot GoldBar";

  // Convert the string to UTF-8 bytes
  const utf8Bytes = ethers.utils.toUtf8Bytes(inputString);

  // Compute keccak256 hash of the bytes to get a bytes32 salt
  const salt = ethers.utils.keccak256(utf8Bytes);

  console.log("Input String:", inputString);
  console.log("Salt (bytes32):", salt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error converting string to salt:", error);
    process.exit(1);
  });
