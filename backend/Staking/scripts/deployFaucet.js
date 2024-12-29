const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // You need to replace these addresses with the actual addresses you intend to use
  const _peridot = "0x16d8e28777581d8A4bf282aDB694e9F987019111";

  const PeridotFaucet = await hre.ethers.getContractFactory("PeridotFaucet");
  const peridotFaucet = await PeridotFaucet.deploy(_peridot);

  await peridotFaucet.deployed();

  console.log("PeridotFaucet deployed to:", peridotFaucet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
