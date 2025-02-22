const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Link libraries to PeridotTokenFactory
  const PeridotTokenFactory = await hre.ethers.getContractFactory(
    "PeridotTokenFactory",
    {
      libraries: {
        PeridotFFTHelper: "0x2d271deb2596d78aaa2551695ebfa9cd440713ac",
        PeridotMiniNFTHelper: "0x60a8bd81f90526560344c63279210bc067a489a5",
      },
    }
  );

  // Deploy PeridotTokenFactory with linked libraries
  const daoAddress = "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9";
  const swapAddress = "0xb5786E3Ec4CaEF89dBC88c2811Fc5511634261E3";
  const vaultAddress = "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9";
  const PFvaultAddress = "0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9";
  const peridotTokenFactory = await PeridotTokenFactory.deploy(
    daoAddress,
    swapAddress,
    vaultAddress,
    PFvaultAddress
  );

  await peridotTokenFactory.waitForDeployment();
  console.log(
    "PeridotTokenFactory deployed to:",
    await peridotTokenFactory.getAddress()
  );
}

/*
npx hardhat verify --libraries scripts/libraries.js 0xEFDC945B7D099A768B06b2973bc71e4389E2d2CE 0xced23360932b80d18fdeaeaa573202e80a584804 0x6d208789f0a978af789a3c8ba515749598940716 0x49b7e0B48980059Bd7eaF1E0987F6ad73f6285e4 0x49b7e0B48980059Bd7eaF1E0987F6ad73f6285e4 --network neox-t4
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
