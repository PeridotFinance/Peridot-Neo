import { web3s, currentAccount } from "./web3Base.js";

import miniNftAbi from "../../data/abis/miniNft.json";

// ---- GETTER (MINI NFT) ----

export async function getMiniNftBalance(chain, miniNftAddress) {
	return getBlindBoxBalance(chain, miniNftAddress, 0);
}

export async function getMiniNftCount(chain, miniNftAddress) {
	return getBlindBoxCount(chain, miniNftAddress, 0);
}

// ---- GETTER (BLIND BOX) ----

export async function getBlindBoxBalance(chain, miniNftAddress, blindBoxId) {
	let miniNftContract = new web3s[chain].Contract(miniNftAbi, miniNftAddress);

	return miniNftContract.methods.balanceOf(currentAccount, blindBoxId).call();
}

export async function getBlindBoxCount(chain, miniNftAddress, blindBoxId) {
	let miniNftContract = new web3s[chain].Contract(miniNftAbi, miniNftAddress);

	return miniNftContract.methods.totalSupply(blindBoxId).call();
}