import { isTestnetPath } from "../lib/helper.js";

const chains = [
  /*{
		id: 421614,
		hex: "0x66eee",
		url: "https://endpoints.omniatech.io/v1/NEOXitrum/sepolia/public",
		name: "NEOXitrum Sepolia Testnet",
		nameId: "NEOX",
		currency: {
			name: "Sepolia Ethereum",
			symbol: "ETH",
			decimals: 18,
		},
		blockExplorer: "https://sepolia.NEOXiscan.io",
		lpSymbol: "UNI-LP",
		lpUrl: "https://app.uniswap.org/swap?chain=NEOXitrum-sepolia",
		marketUrl: "https://testnets.opensea.io/assets/NEOXitrum-sepolia",
		wrappedContract: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
		moralisId: undefined
	},
	{
		id: 84532,
		hex: "0x14a34",
		url: "https://base-sepolia.gateway.tenderly.co",
		name: "Base Sepolia Testnet",
		nameId: "BASE",
		currency: {
			name: "Base Ethereum",
			symbol: "ETH",
			decimals: 18,
		},
		blockExplorer: "https://sepolia.basescan.org",
		lpSymbol: undefined,
		lpUrl: undefined,
		marketUrl: undefined,
		wrappedContract: undefined,
		moralisId: undefined
	}*/
  {
    id: 12227332,
    hex: "0xba9304",
    url: "https://neoxt4seed1.ngd.network/",
    name: "Neo X T4 Testnet",
    nameId: "NEOXT4",
    currency: {
      name: "Testnet GAS",
      symbol: "GAS",
      decimals: 18,
    },
    blockExplorer: "https://xt4scan.ngd.network/",
    lpSymbol: "UNI-LP",
    lpUrl: "https://app.uniswap.org/swap?chain=NEOXitrum-sepolia",
    marketUrl: "https://testnets.opensea.io/assets/NEOXitrum-sepolia",
    wrappedContract: "0x1CE16390FD09040486221e912B87551E4e44Ab17",
    moralisId: undefined,
  },
  {
    id: 47763,
    hex: "0xba93",
    url: "https://mainnet-1.rpc.banelabs.org/",
    name: "Neo X",
    nameId: "NEOX",
    currency: {
      name: "GAS",
      symbol: "GAS",
      decimals: 18,
    },
    blockExplorer: "https://xexplorer.neo.org/",
    lpSymbol: "UNI-LP",
    lpUrl: "https://app.uniswap.org/swap?chain=NEOXitrum-sepolia",
    marketUrl: "https://testnets.opensea.io/assets/NEOXitrum-sepolia",
    wrappedContract: "0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF",
    moralisId: undefined,
  },
];

export function getChains() {
  let filteredChains = chains;

  if (!isTestnetPath()) {
    filteredChains = filteredChains.filter((chain) => chain.id !== 421614);
  }

  return filteredChains;
}

export function getChain(nameId) {
  return chains.find((chain) => chain.nameId === nameId);
}

export function getChainById(id) {
  return chains.find((chain) => chain.id === id);
}

export function getWalletConnectChainIds() {
  let supportedIds = [421614];

  let chainIds = chains.map((chain) => chain.id);
  let filteredIds = chainIds.filter((id) => supportedIds.includes(id));

  return filteredIds;
}
