import Decimal from "decimal.js";
import { web3Provider, getSendMessage, getChainName, toWei, approve } from "./web3Base.js";

import { contracts } from "../../data/contracts.js";

import fractionTokenAbi from "../../data/abis/fractionToken.json";
import miniNftAbi from "../../data/abis/miniNft.json";
import swapMainnetAbi from "../../data/abis/swapMainnet.json";
import swapTestnetAbi from "../../data/abis/swapTestnet.json";

// ---- GETTER ----

export async function getBottomValue(isTokenBottom, tax, inputAmount) {
	let conversion = 1000;

	let taxDecimalPos = new Decimal(1 + (tax / 100)); // 1.03
	let taxDecimalNeg = new Decimal(1 - (tax / 100)); // 0.97
	let inputAmountDecimal = new Decimal(inputAmount);

	let bottomValue = undefined;

	if (isTokenBottom) {
		bottomValue = inputAmountDecimal.times(conversion).times(taxDecimalNeg);
	} else {
		bottomValue = inputAmountDecimal.div(taxDecimalPos).div(conversion);
	}

	return bottomValue;
}

export async function getTopValue(isTokenBottom, tax, outputAmount) {
	let conversion = 1000;

	let taxDecimalPos = new Decimal(1 + (tax / 100)); // 1.03
	let taxDecimalNeg = new Decimal(1 - (tax / 100)); // 0.97
	let outputAmountDecimal = new Decimal(outputAmount);

	let topValue = undefined;

	if (isTokenBottom) {
		topValue = outputAmountDecimal.div(taxDecimalNeg).div(conversion);
	} else {
		topValue = outputAmountDecimal.times(taxDecimalPos).times(conversion);
	}

	return topValue;
}

// ---- INTERACTIONS (APPROVE) ----

export async function approveNft(miniNftContract, swapAddress) {
	return miniNftContract.methods.setApprovalForAll(swapAddress, true).send(getSendMessage());
}

// ---- INTERACTIONS (SWAP) ----

export async function swapMiniNftToNft(nftAddress, miniNftAddress) {
	let chain = await getChainName();

	let swapAbi = (chain === "TESTNET") ? swapTestnetAbi : swapMainnetAbi;

	let miniNftContract = new web3Provider.Contract(miniNftAbi, miniNftAddress);
	let swapContract = new web3Provider.Contract(swapAbi, contracts[chain].swap);

	return approveNft(miniNftContract, contracts[chain].swap).then(async () => {
		let extraMessage = (chain === "TESTNET") ? { value: "0" } : {};

		return swapContract.methods.swapMiniNFTtoNFT(nftAddress).send(getSendMessage(extraMessage));
	});
}

export async function swapMiniNftToToken(miniNftAddress, inputAmount) {
	let chain = await getChainName();

	let swapAbi = (chain === "TESTNET") ? swapTestnetAbi : swapMainnetAbi;

	let miniNftContract = new web3Provider.Contract(miniNftAbi, miniNftAddress);
	let swapContract = new web3Provider.Contract(swapAbi, contracts[chain].swap);

	return approveNft(miniNftContract, contracts[chain].swap).then(() => {
		let blindBoxId = 0;

		return swapContract.methods.swapMiniNFTtoFFT(miniNftContract, blindBoxId, inputAmount).send(getSendMessage());
	});
}

export async function swapTokenToMiniNft(tokenAddress, miniNftAddress, inputAmount, outputAmount) {
	let chain = await getChainName();

	let swapAbi = (chain === "TESTNET") ? swapTestnetAbi : swapMainnetAbi;

	let tokenContract = new web3Provider.Contract(fractionTokenAbi, tokenAddress);
	let swapContract = new web3Provider.Contract(swapAbi, contracts[chain].swap);

	let weiInputAmount = toWei(inputAmount);

	return approve(tokenContract, contracts[chain].swap, weiInputAmount).then(() => {
		return swapContract.methods.swapFFTtoMiniNFT(miniNftAddress, outputAmount).send(getSendMessage());
	});
}
