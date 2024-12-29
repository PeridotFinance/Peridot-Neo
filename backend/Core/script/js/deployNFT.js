const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const WrappedMAYC = await hre.ethers.getContractFactory("WrappedMAYC");
  const wrappedMAYC = await WrappedMAYC.deploy();

  await wrappedMAYC.waitForDeployment();

  console.log("WrappedMAYC deployed to:", await wrappedMAYC.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
