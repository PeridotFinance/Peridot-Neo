require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.26",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.27",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    /*amoy: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY_TEST],
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY_TEST],
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY_TEST],
    },*/
    "neox-t4": {
      url: process.env.NEO_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY_TEST],
      gasPrice: 41000000000,
      gas: 3000000,
    },
    neox: {
      url: process.env.NEO_URL,
      accounts: [process.env.PRIVATE_KEY_MAIN],
      gasPrice: 47000000000,
      gas: 3000000,
    },
  },
  etherscan: {
    apiKey: {
      /*amoy: process.env.POLYGONSCAN_KEY,
      sepolia: process.env.ETHERSCAN_KEY,
      arbitrumSepolia: process.env.ARBITRUMSCAN_KEY,*/
      "neox-t4": "empty",
      neox: "empty",
    },
    customChains: [
      {
        network: "neox-t4",
        chainId: 12227332,
        urls: {
          apiURL: "https://xt4scan.ngd.network:8877/api",
          browserURL: "https://neoxt4scan.ngd.network",
        },
      },
      {
        network: "neox",
        chainId: 47763,
        urls: {
          apiURL: "https://xexplorer.neo.org:8877/api",
          browserURL: "https://neoxscan.ngd.network",
        },
      },
      /*{
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/",
        },
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },*/
    ],
  },
  paths: {
    sources: path.join(__dirname, "contracts"),
    artifacts: path.join(__dirname, "artifacts"),
    cache: path.join(__dirname, "cache"),
    tests: path.join(__dirname, "test"),
  },
};
