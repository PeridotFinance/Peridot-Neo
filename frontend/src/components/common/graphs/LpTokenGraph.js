import { Label, XAxis, YAxis, Line } from "recharts";
import GraphContainer from "./GraphContainer.js";

export default function GraphExample({data}) {
	const xKey = "time";
	const yLeftKey = "value";

	const yAxisId = 2;

	const xAxisFontSize = 11;
	const yAxisFontSize = 11;

	const yAxisLabelOffset = 15;
	const yAxisLabelColor = "#d1d1d1";

	const yAxisLabel = "Price [$]";

	const chartType = "monotone";
	const chartWidth = 2;
	const chartScope = 0.01;
	const chartColor = "#8dc647";
	const chartName = "TVL per LP Token";

	// ---- FUNCTIONS ----

	function formatXTick(tick) {
		let dateTimeSplit = tick.split(" ");
		let dateSplit = dateTimeSplit[0].split("/");

		let dateWithoutYear = dateSplit[0] + "/" + dateSplit[1];

		return dateWithoutYear + " " + dateTimeSplit[1];
	}

	function formatYTick(tick) {
		return parseFloat(tick).toFixed(4);
	}

	return (
		<GraphContainer data={data}>
			<XAxis dataKey={xKey} tick={{fontSize: xAxisFontSize}} tickFormatter={formatXTick}/>

			<YAxis orientation="left" yAxisId={yAxisId} tick={{fontSize: yAxisFontSize}} tickFormatter={formatYTick} domain={[dataMin => (dataMin - dataMin * chartScope), dataMax => (dataMax + dataMax * chartScope)]}>
				<Label offset={yAxisLabelOffset} position="top" style={{fill: yAxisLabelColor, textAnchor: "start"}} value={yAxisLabel}/>
			</YAxis>

			<Line type={chartType} yAxisId={yAxisId} dataKey={yLeftKey} name={chartName} stroke={chartColor} strokeWidth={chartWidth} dot={false}/>
		</GraphContainer>
	);
}