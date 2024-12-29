const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CompoundLens = await hre.ethers.getContractFactory("CompoundLens");
  const compoundLens = await CompoundLens.deploy();

  await compoundLens.deployed();

  console.log("CompoundLens deployed to:", compoundLens.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
