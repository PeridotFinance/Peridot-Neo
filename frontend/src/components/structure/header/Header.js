import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import ExternalLink from "../../common/links/ExternalLink.js";
import InternalLink from "../../common/links/InternalLink.js";
import { WindowWidthContext } from "../../../components-helper/contexts/WindowWidthProvider.js";
import Background from "../../common/others/Background.js";
import Logo from "../../common/others/Logo.js";
import ChainDropdown from "./ChainDropdown.js";
import ConnectButton from "./ConnectButton.js";
import MenuButton from "./MenuButton.js";
import ProviderModal from "./ProviderModal.js";
import { conc, cond, getCssVariablePixel } from "../../../lib/wrapper/html.js";

export default function Header() {
	const mobileBreakpoint = getCssVariablePixel("--mobile-breakpoint-big");

	const location = useLocation();

	const windowWidth = useContext(WindowWidthContext);

	const [isChecked, setIsChecked] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// ---- HOOKS ----

	useEffect(() => {
		resetModal();
	}, [location]);

	useEffect(() => {
		if (isChecked === true && windowWidth > mobileBreakpoint) {
			setIsChecked(false);
		}
	}, [windowWidth]);

	useEffect(() => {
		if (isChecked === false) {
			setIsModalOpen(false);
		}
	}, [isChecked]);

	// ---- FUNCTIONS ----

	function resetModal() {
		setIsChecked(false);
		setIsModalOpen(false);
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleConnectWalletButton() {
		setIsModalOpen(true);
	}

	return (
		windowWidth > mobileBreakpoint
		?
			<header className={conc(styles.header, styles.header_desktop)}>
				<Background isActive={isModalOpen} onClick={() => setIsModalOpen(false)}/>

				<div className={styles.logo_container}>
					<Logo/>
				</div>

				<nav className={styles.nav_desktop}>
					<InternalLink link={"/peridot-swap"} otherClasses={conc(styles.link, styles.link_desktop)} activeClasses={styles.link_active} onClick={resetModal}>Peridot-Swap</InternalLink>
					<InternalLink link={"/ifo"} otherClasses={conc(styles.link, styles.link_desktop)} activeClasses={styles.link_active} onClick={resetModal}>IFO</InternalLink>
					<InternalLink link={"/inventory"} otherClasses={conc(styles.link, styles.link_desktop)} activeClasses={styles.link_active} onClick={resetModal}>Inventory</InternalLink>
					<ExternalLink link={"https://neoxwish.ngd.network"} otherClasses={conc(styles.link, styles.link_desktop)} onClick={resetModal}>Faucet</ExternalLink>
				</nav>

				<div className={styles.function_container}>
					<ConnectButton onClick={handleConnectWalletButton}/>
					<ChainDropdown/>
				</div>

				{
					isModalOpen &&
					<ProviderModal closeModal={() => resetModal()}/>
				}
			</header>
		:
			<header className={conc(styles.header, styles.header_mobile)}>
				<Background isActive={isChecked || isModalOpen} onClick={() => resetModal()}/>
				
				<Logo/>

				<MenuButton getter={isChecked} setter={setIsChecked}/>

				{
					isModalOpen && isChecked
					?
						<ProviderModal closeModal={() => resetModal()}/>
					:
						<nav className={conc(styles.nav_mobile, cond(isChecked, styles.nav_mobile_visible))}>
							<InternalLink link={"/peridot-swap"} otherClasses={conc(styles.link, styles.link_mobile)} activeClasses={styles.link_active} onClick={resetModal}>Peridot-Swap</InternalLink>
							<InternalLink link={"/ifo"} otherClasses={conc(styles.link, styles.link_mobile)} activeClasses={styles.link_active} onClick={resetModal}>IFO</InternalLink>
							<InternalLink link={"/inventory"} otherClasses={conc(styles.link, styles.link_mobile)} activeClasses={styles.link_active} onClick={resetModal}>Inventory</InternalLink>
							
							<hr/>

							<ExternalLink link={"https://neoxwish.ngd.network"} otherClasses={conc(styles.link, styles.link_mobile)} onClick={resetModal}>Faucet</ExternalLink>

							<hr/>

							<div className={styles.function_container}>
								<ConnectButton onClick={handleConnectWalletButton}/>
								<ChainDropdown/>
							</div>
						</nav>
				}
			</header>
	);
}