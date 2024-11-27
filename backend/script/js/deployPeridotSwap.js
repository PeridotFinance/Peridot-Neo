const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PeridotSwap = await hre.ethers.getContractFactory("PeridotSwap");
  const peridotSwap = await PeridotSwap.deploy();

  await peridotSwap.waitForDeployment();

  console.log("PeridotSwap deployed to:", await peridotSwap.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
