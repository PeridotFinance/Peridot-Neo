import { useState, useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadAll } from "@tsparticles/all";
import styles from "./ParticlesDiv.module.scss";
import { getCssVariableColor } from "../../../lib/wrapper/html.js";

export default function ParticlesDiv() {
	const color1 = getCssVariableColor("--color-1");
	const color2 = getCssVariableColor("--color-2");

	const config = {
		background: {
			color: {
				value: color1,
			},
		},
		fpsLimit: 144,
		interactivity: {
			events: {
				onClick: {
					enable: true,
					mode: "push"
				},
				onHover: {
					enable: true,
					mode: "bubble"
				},
				resize: true
			},
			modes: {
				push: {
					quantity: 3,
				},
				bubble: {
					distance: 100,
					size: 2,
					duration: 3,
					opacity: 1,
					speed: 3
				}
			},
			detect_on: "window"
		},
		particles: {
			color: {
				value: color2
			},
			move: {
				enable: true,
				direction: "none",
				out_mode: "out",
				bounce: false,
				random: true,
				speed: 0.3,
				straight: false
			},
			number: {
				value: 400,
				density: {
					enable: true,
					value_area: 800
				}
			},
			opacity: {
				value: 0.6,
				random: false,
				anim: {
					enable: true,
					speed: 0.2,
					opacity_min: 0,
					sync: false
				}
			},
			shape: {
				type: "circle"
			},
			size: {
				value: { min: 1, max: 2 },
			}
		},
		retina_detect: true
	};

	const options = useMemo(() => config, []);

	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async engine => {
			await loadAll(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	return (
		init &&
		<Particles id="tsparticles" options={options} className={styles.container}/>
	);
}