import { useState, useContext, useEffect } from "react";
import styles from "./ConnectButton.module.scss";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { isMetaMaskInstalled, isMetaMaskConnected, isWalletConnectConnected, getAccount } from "../../../lib/web3/web3Base.js";

import { projectName } from "../../../data/project.js";

export default function ConnectButton({onClick}) {
	const { isConnected } = useContext(ConnectionContext);

	const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
	const [providerName, setProviderName] = useState(undefined);

	// ---- HOOKS ----

	useEffect(() => {
		refreshAccount();
		refreshProvider();
	}, [isConnected]);

	// ---- FUNCTIONS ----

	function refreshAccount() {
		if (isConnected === true) {
			getAccount().then(account => {
				let accountText = account.substring(0, 6) + "..." + account.substring(account.length - 4, account.length);

				setConnectButtonText(accountText);
			});
		}
	}

	function refreshProvider() {
		isWalletConnectConnected().then(isWalletConnectStatus => {
			if (isWalletConnectStatus) {
				setProviderName("walletconnect");
			} else {
				let isMMInstalled = isMetaMaskInstalled();

				if (isMMInstalled) {
					isMetaMaskConnected().then(isMetaMaskStatus => {
						if (isMetaMaskStatus) {
							setProviderName("metamask");
						}
					});
				}
			}
		});
	}

	return (
		<button className={styles.connect_button} onClick={onClick}>
			{
				(providerName !== undefined && connectButtonText !== "Connect Wallet") &&
				<img className={styles.provider_image} src={"/images/providers/" + providerName + ".svg"} alt={providerName + " provider for " + projectName}/>
			}
			<span>{connectButtonText}</span>
		</button>
	);
}