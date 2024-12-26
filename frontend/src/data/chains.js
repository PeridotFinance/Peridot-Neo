const chains = [
	{
		id: 47763,
		hex: "0xba93",
		url: "https://mainnet-1.rpc.banelabs.org",
		name: "Neo X",
		nameId: "MAINNET",
		currency: {
			name: "Neo X GAS",
			symbol: "GAS",
			decimals: 18,
		},
		blockExplorer: "https://xexplorer.neo.org",
		lpSymbol: undefined,
		lpUrl: undefined,
		marketUrl: "https://ghostmarket.io/de/asset/neox",
		wrappedContract: undefined,
		moralisId: undefined
	},
	{
		id: 12227332,
		hex: "0xba9304",
		url: "https://neoxt4seed1.ngd.network",
		name: "Neo X Testnet",
		nameId: "TESTNET",
		currency: {
			name: "Neo X GAS",
			symbol: "GAS",
			decimals: 18,
		},
		blockExplorer: "https://xt4scan.ngd.network",
		lpSymbol: undefined,
		lpUrl: undefined,
		marketUrl: "https://ghostmarket.io/de/asset/neox",
		wrappedContract: undefined,
		moralisId: undefined
	}
];

export function getChains() {
	let filteredChains = chains;
	let currentPath = window.location.href;

	if (!currentPath.includes("localhost")) {
		if (currentPath.includes("testnet.peridot.finance")) {
			filteredChains = filteredChains.filter(chain => chain.nameId === "TESTNET");
		} else if (currentPath.includes("peridot.finance")) {
			filteredChains = filteredChains.filter(chain => chain.nameId === "MAINNET");
		}
	}

	return filteredChains;
}

export function getChain(nameId) {
	return chains.find(chain => chain.nameId === nameId);
}

export function getChainById(id) {
	return chains.find(chain => chain.id === id);
}

export function getWalletConnectChainIds() {
	return [56];
}