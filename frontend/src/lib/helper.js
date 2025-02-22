export function isSameDay(date1, date2) {
	let isSameYear = date1.getFullYear() === date2.getFullYear();
	let isSameMonth = date1.getMonth() === date2.getMonth();
	let isSameDay = date1.getDate() === date2.getDate();

	return isSameYear && isSameMonth && isSameDay;
}

export function getChainFilteredSet(set) {
	let currentPath = window.location.href;
	let newSet = set;

	if (!currentPath.includes("localhost")) {
		if (currentPath.includes("testnet.peridot.finance")) {
			delete newSet.MAINNET;
		} else if (currentPath.includes("peridot.finance")) {
			delete newSet.TESTNET;
		}
	}

	return newSet;
}

export function isDefined(...params) {
	return params.every(param => param !== undefined && param !== "");
}

export function getDollarFormat(value) {
	let format = undefined;

	if (value !== undefined) {
		format = "$" + parseFloat(value).toFixed(2);
	}

	return format;
}

export function isZeroAddress(address) {
	return address === "0x0000000000000000000000000000000000000000";
}

export function isAddress(address) {
	let regex = /^0x[A-Fa-f0-9]{40}$/;

	return regex.test(address);
}

export function toDateString(timestamp) {
	return (new Date(timestamp)).toLocaleString("en-GB");
}