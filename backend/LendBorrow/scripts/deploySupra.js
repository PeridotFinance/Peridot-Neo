const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SupraPriceOracle = await hre.ethers.getContractFactory(
    "SupraPriceOracle"
  );
  const supraPriceOracle = await SupraPriceOracle.deploy(
    "0xc99c8510d9ff355cd664f9412bdd645c5e25a7f1"
  );

  await supraPriceOracle.deployed();

  console.log("SupraPriceOracle deployed to:", supraPriceOracle.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
