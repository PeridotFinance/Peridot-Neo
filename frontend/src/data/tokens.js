import { getChain } from "./chains.js";
import { getChainFilteredSet } from "../lib/helper.js";

const basePath = "/images/tokens/";

const tokens = {
	MAINNET: [
		{
			symbol: "FFT",
			contract: "0x38dd5d8EbE6061A3242701e3897EFe9A545F0A29",
			decimals: 18,
			coingeckoId: undefined,
			imagePath: basePath + "placeholder.svg"
		},
		{
			symbol: "GAS",
			decimals: 18,
			coingeckoId: undefined,
			imagePath: basePath + "GAS.png"
		}
	],
	TESTNET: [
		{
			symbol: "FFT",
			contract: "0x002e17a2B77f7cF5FA19722658C685c12156d495",
			decimals: 18,
			coingeckoId: undefined,
			imagePath: basePath + "placeholder.svg"
		},
		{
			symbol: "GAS",
			decimals: 18,
			coingeckoId: undefined,
			imagePath: basePath + "GAS.png"
		}
	],
};

// ---- GET ALL TOKENS ----

export function getAllTokens() {
	let allTokens = [];
	let currentTokens = getChainFilteredSet(tokens);

	for (const [chainName, tokens] of Object.entries(currentTokens)) {
		let chain = getChain(chainName);

		let newTokens = tokens.map(token => {
			return {...token, chain: chain};
		});

		allTokens = [...allTokens, ...Object.values(newTokens)];
	}

	return allTokens;
}

// ---- GET SPECIFIC TOKEN ----

export function getToken(chain, symbol) {
	return getAllTokens().find(token => token.chain.nameId === chain && token.symbol === symbol);
}

export function getTokenByContract(chain, contract) {
	return getAllTokens().find(token => token.chain.nameId === chain && token.contract === contract);
}
