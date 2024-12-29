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
  const salt =
    "0x08201f091016e11ea3768478351bbb02faa1a6596ea503db30b3bb41e8d2b99f";
  const miniNFTBaseUri =
    "ipfs://bafybeiadtdjbr6nd6ogtbjcy56oh2ymaxhw5djjdrl2zvhgngir2s3dqiq";
  const nftName = "Test NFT";
  const nftSymbol = "WMAYC";

  console.log("Calling createCollectionPair...");

  // Call the function
  const tx = await peridotFactory.createCollectionPair(
    projectAddress,
    salt,
    miniNFTBaseUri,
    nftName,
    nftSymbol
  );

  console.log("Transaction sent. Waiting for confirmation...");
  const receipt = await tx.wait();

  console.log("Transaction confirmed in block", receipt.blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
