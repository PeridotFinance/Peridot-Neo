const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // You need to replace these addresses with the actual addresses you intend to use
  const _peridot = "0x16d8e28777581d8A4bf282aDB694e9F987019111";

  const PeridotBar = await hre.ethers.getContractFactory("PeridotBar");
  const peridotBar = await PeridotBar.deploy(_peridot);

  await peridotBar.deployed();

  console.log("PeridotBar deployed to:", peridotBar.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
