const hre = require("hardhat");

/**
 * Example script that:
 *   1. Fetches proof bytes from Supra's REST endpoint
 *   2. Calls the SupraPriceOracle contract to update prices
 */
async function main() {
  // -------------------------------------
  // STEP 1: Set Up Configuration
  // -------------------------------------

  // Example: Using testnet endpoint from Supra docs
  // (Change to mainnet if you are on mainnet.)
  const supraRestEndpoint = "https://rpc-testnet-dora-2.supra.com"; // Example endpoint

  // Example: Pair indexes for which you want to fetch the proof
  // This must match the pairs you’ve set in your on-chain logic
  const pairIndexes = [0, 21, 61, 49];

  // Example: You may need to specify the chain type for the REST call
  const chainType = "evm";

  // Address of your deployed SupraPriceOracle (replace with your actual contract address)
  const supraPriceOracleAddress = "0xYourSupraPriceOracleAddress";

  // -------------------------------------
  // STEP 2: Fetch Proof Bytes from Supra
  // -------------------------------------

  // Construct your REST call payload.
  // The actual parameters depend on Supra's REST service specs.
  const requestBody = {
    pairIndexes,
    chainType,
  };

  console.log("Fetching proof data from Supra...");

  // This is a simplistic example. Adjust as needed for Supra's actual API structure.
  let proofBytes;
  try {
    const response = await fetch(`${supraRestEndpoint}/getProof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `Supra API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    // Assuming the response returns proof bytes in a field called 'proofBytes'
    // Check Supra docs / examples for the actual JSON format
    proofBytes = data.proofBytes;
    console.log("Successfully fetched proof bytes from Supra:", proofBytes);
  } catch (error) {
    console.error("Error fetching proof data:", error);
    process.exit(1);
  }

  // -------------------------------------
  // STEP 3: Connect to Your Oracle Contract
  // -------------------------------------

  const SupraPriceOracle = await hre.ethers.getContractFactory(
    "SupraPriceOracle"
  );
  const supraPriceOracle = SupraPriceOracle.attach(supraPriceOracleAddress);

  // Get the signer (the account that will send the tx)
  // This will use the first account in Hardhat's accounts by default,
  // or whatever is configured in hardhat.config.js
  const [deployer] = await ethers.getSigners();
  console.log("Using signer:", deployer.address);

  // -------------------------------------
  // STEP 4: Update Prices On-Chain
  // -------------------------------------
  console.log(
    `Calling updatePrices on SupraPriceOracle at ${supraPriceOracleAddress}...`
  );

  try {
    // updatePrices(bytes calldata _bytesProof) is the function that expects proofBytes
    const tx = await supraPriceOracle
      .connect(deployer)
      .updatePrices(proofBytes);
    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction mined in block", receipt.blockNumber);
  } catch (error) {
    console.error("Error calling updatePrices:", error);
    process.exit(1);
  }

  console.log("Prices updated successfully!");
}

// -------------------------------------
// Run the main function
// -------------------------------------
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
