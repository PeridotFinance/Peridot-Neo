const hre = require("hardhat");

async function main() {
  // Replace with actual deployed contract address
  const contractAddress = "0x55C274428fc58804F68d0d7C1413299f1cfCF269";

  // Get the signer who is the factory owner
  const [owner] = await hre.ethers.getSigners();

  // Get the contract instance
  const peridotFactory = await hre.ethers.getContractAt(
    "PeridotTokenFactory",
    contractAddress,
    owner
  );

  // Define your parameters
  const projectAddress = "0x92197cC1800C563d2A5c2508cEd85aA439730ef9"; // Replace with an actual address

  console.log("Calling projectToFFT...");

  // Call the function
  const tx = await peridotFactory.projectToFFT(projectAddress);

  const fftAddress = await peridotFactory.projectToFFT(projectAddress);

  console.log("FFT Address for this project is:", fftAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
