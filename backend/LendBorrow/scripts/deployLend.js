const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  /*const Peridot = await hre.ethers.getContractFactory("Peridot");
  const peridot = await Peridot.deploy(deployer.address);

  await peridot.deployed();

  console.log("Peridot deployed to:", peridot.address);

  const PeridotrollerG7 = await hre.ethers.getContractFactory(
    "PeridotrollerG7"
  );
  const peridotrollerG7 = await PeridotrollerG7.deploy(peridot.address);

  await peridotrollerG7.deployed();

  console.log("PeridotrollerG7 deployed to:", peridotrollerG7.address);

  const Unitroller = await hre.ethers.getContractFactory("Unitroller");
  const unitroller = await Unitroller.deploy();

  await unitroller.deployed();

  console.log("Unitroller deployed to:", unitroller.address);

  const SimplePriceOracle = await hre.ethers.getContractFactory(
    "SimplePriceOracle"
  );
  const simplePriceOracle = await SimplePriceOracle.deploy();

  await simplePriceOracle.deployed();

  console.log("SimplePriceOracle deployed to:", simplePriceOracle.address);

  const JumpRateModelV2 = await hre.ethers.getContractFactory(
    "JumpRateModelV2"
  );
  const jumpRateModelV2 = await JumpRateModelV2.deploy(
    hre.ethers.utils.parseEther("0.02"), // 2% base rate per year
    hre.ethers.utils.parseEther("0.1"), // 10% multiplier per year
    hre.ethers.utils.parseEther("1.0"), // 100% jump multiplier per year
    hre.ethers.utils.parseEther("0.8"), // 80% kink
    deployer.address
  );

  await jumpRateModelV2.deployed();

  console.log("jumpRateModelV2 deployed to:", jumpRateModelV2.address); */

  /* const CEther = await hre.ethers.getContractFactory("CEther");
  const cEther = await CEther.deploy(
    "0x852C9A07f1ECFDE2Dbf2E9067Ca35921D5c9Ab3f",
    "0x92Fa9A9A0CD6d78A15Bb6DBb67A17bb5C4C1120b",
    hre.ethers.utils.parseEther("200000000"),
    "Peridot GAS",
    "pGAS",
    8,
    deployer.address
  );
  /*@param comptroller_ The address of the Comptroller
   * @param interestRateModel_ The address of the interest rate model
   * @param initialExchangeRateMantissa_ The initial exchange rate, scaled by 1e18
   * @param name_ ERC-20 name of this token
   * @param symbol_ ERC-20 symbol of this token
   * @param decimals_ ERC-20 decimal precision of this token
   * @param admin_ Address of the administrator of this token

  await cEther.deployed();

  console.log("CEther deployed to:", cEther.address); */

  /*const CErc20 = await hre.ethers.getContractFactory("CErc20");
  const cErc20 = await CErc20.deploy();

  await cErc20.deployed();

  console.log("CErc20 deployed to:", cErc20.address);

  const Maximillion = await hre.ethers.getContractFactory("Maximillion");
  const maximillion = await Maximillion.deploy(
    "0x5800b480382e23cbe3553590169b78a42809d22c" //cether
  );

  await maximillion.deployed();

  console.log("Maximillion deployed to:", maximillion.address); */

  const Lens = await hre.ethers.getContractFactory("Lens");
  const lens = await Lens.deploy();

  await lens.deployed();

  console.log("CompoundLens deployed to:", lens.address);

  const SupraPriceOracle = await hre.ethers.getContractFactory(
    "SupraPriceOracle"
  );
  const supraPriceOracle = await SupraPriceOracle.deploy(
    "0x8B506d2616671b6742b968C18bEFdA1e665A9025" //Address NeoX Mainnet
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
