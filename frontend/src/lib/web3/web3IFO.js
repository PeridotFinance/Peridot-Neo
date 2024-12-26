import { web3Provider, getSendMessage, toWei } from "./web3Base.js";

import miniNftAbi from "../../data/abis/miniNft.json";

// ---- INTERACTIONS ----

export async function mintBlindBox(miniNftAddress, amount, price) {
	let miniNftContract = new web3Provider.Contract(miniNftAbi, miniNftAddress);

	let extraMessage = {
		value: toWei(price).toString()
	}; 

	return miniNftContract.methods.mintBlindBox(amount).send(getSendMessage(extraMessage));
}