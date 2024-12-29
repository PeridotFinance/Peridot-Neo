const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CEther = await hre.ethers.getContractFactory("CEther");
  const cEther = await CEther.deploy(
    "0x58Ca60610Bf8962d01fc275452F5fA9179940CC9",
    "0x9Acb8a32756F19827D9f25429A0fF937C96D3c0f",
    hre.ethers.utils.parseEther("200000000"),
    "Peridot GAS",
    "pGAS",
    8,
    "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9"
  );
  /*@param comptroller_ The address of the Comptroller
   * @param interestRateModel_ The address of the interest rate model
   * @param initialExchangeRateMantissa_ The initial exchange rate, scaled by 1e18
   * @param name_ ERC-20 name of this token
   * @param symbol_ ERC-20 symbol of this token
   * @param decimals_ ERC-20 decimal precision of this token
   * @param admin_ Address of the administrator of this token*/

  await cEther.deployed();

  console.log("CEther deployed to:", cEther.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
