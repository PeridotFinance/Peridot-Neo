import {useState, useEffect, useRef} from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import styles from "./VantaDiv.module.scss";
import { getCssVariableColorNumber } from "../../../lib/wrapper/html.js";

export default function VantaDiv({children}) {
	const primaryColor = getCssVariableColorNumber("--color-1");
	const secondaryColor = getCssVariableColorNumber("--color-2");
	const backgroundPrimaryColor = getCssVariableColorNumber("--color-1");
	const backgroundSecondaryColor = getCssVariableColorNumber("--color-1");

	const [vantaEffect, setVantaEffect] = useState(undefined);
	const vantaRef = useRef(null);

	useEffect(() => {
		if (vantaEffect === undefined) {
			setVantaEffect(GLOBE({
				el: vantaRef.current,
				THREE: THREE,
				mouseControls: true,
				touchControls: true,
				gyroControls: false,
				color: secondaryColor,
				color2: secondaryColor,
				backgroundColor: backgroundSecondaryColor,
				size: 1,
				scale: 1.00,
				scaleMobile: 1.00
			}));
		}

		return () => {
			if (vantaEffect !== undefined) {
				vantaEffect.destroy();
			}
		}
	}, []);

	return (
		<div className={styles.container} ref={vantaRef}>
			{children}
		</div>
	);
}