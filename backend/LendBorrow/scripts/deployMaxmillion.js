const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Maximillion = await hre.ethers.getContractFactory("Maximillion");
  const maximillion = await Maximillion.deploy(
    "0x54C1B040f00Fe2ee261DFed72C67eDE6fBF9b18E" //cether
  );

  await maximillion.deployed();

  console.log("Maximillion deployed to:", maximillion.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
