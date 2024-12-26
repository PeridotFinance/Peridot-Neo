import { useContext } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, Tooltip, Legend } from "recharts";
import styles from "./GraphContainer.module.scss";
import { WindowWidthContext } from "../../../components-helper/contexts/WindowWidthProvider.js";
import { conc, getCssVariablePixel } from "../../../lib/wrapper/html.js";

export default function GraphContainer({children, data}) {
	const graphLoadingMessage = "graph loading...";
	const graphNoDataMessage = "no data for this configuration";

	const chartAspectBig = 2;
	const chartAspectSmall = 1;

	const chartMargins = {
		top: 30,
		right: 10,
		bottom: 0,
		left: 0
	};

	const gridLineLength = 3;
	const gridColor1 = "#000000";
	const gridColor2 = "#222222";
	const gridOpacity = 0.4;

	const tooltipLabelColor = "#000000";

	let firstTime = (data !== undefined && data.length > 0) ? data[0].time : undefined;
	let lastTime = (data !== undefined && data.length > 0) ? data[data.length - 1].time : undefined;

	const mobileBreakpointMedium = getCssVariablePixel("--mobile-breakpoint-medium");
	const mobileBreakpointSmall = getCssVariablePixel("--mobile-breakpoint-small");

	const windowWidth = useContext(WindowWidthContext);

	return (
		<div className={styles.container}>
			{
				data !== undefined
				?
					data.length > 0
					?
						<div className={styles.graph_container}>
							<ResponsiveContainer width="99%" aspect={windowWidth > mobileBreakpointMedium ? chartAspectBig : chartAspectSmall}>
								<LineChart data={data} margin={chartMargins}>
									<CartesianGrid verticalFill={[gridColor1, gridColor2]} fillOpacity={gridOpacity} strokeDasharray={gridLineLength + " " + gridLineLength}/>
			
									{children}
			
									<Tooltip labelStyle={{color: tooltipLabelColor}}/>
									<Legend layout={windowWidth > mobileBreakpointSmall ? "horizontal" : "vertical"}/>
								</LineChart>
							</ResponsiveContainer>
			
							{
								windowWidth > mobileBreakpointSmall
								?
									<div className={styles.graph_info}>
										the graph displays data from {firstTime} to {lastTime}
									</div>
								:
									<div className={conc(styles.graph_info, styles.graph_info_small)}>
										<div>the graph displays data from</div>
										<div>{firstTime} to</div>
										<div>{lastTime}</div>
									</div>
							}
						</div>
					:
						<div>{graphNoDataMessage}</div>
				:
					<div>{graphLoadingMessage}</div>
			}
		</div>
	);
}