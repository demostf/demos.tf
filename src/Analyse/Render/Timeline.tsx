import * as React from 'react';
import {Parser} from "../Data/Parser";

export interface TimelineProps {
	parser: Parser
	tick: number
	onSetTick: (tick: number) => any;
}

export class Timeline extends React.Component<TimelineProps, {}> {
	background: Element;

	render() {
		const {parser, tick, onSetTick}= this.props;
		if (!this.background) {
			this.background =<TimeLineBackground parser={parser}/>;
		}
		return (<div className="timeline">
			{this.background}
			<input className="timeline-progress" type="range" min={0}
			       max={parser.ticks} value={tick}
			       onChange={(event) => {onSetTick(parseInt(event.target.value, 10))}}
			/>
		</div>);
	}
}

import './Timeline.css';
import Element = JSX.Element;

function TimeLineBackground({parser}:{parser: Parser}) {
	const length = Math.floor(parser.ticks / 30);
	const blueHealth = new Uint16Array(length);
	const redHealth = new Uint16Array(length);
	let index = 0;
	for (let tick = 0; tick < parser.ticks; tick += 30) {
		index++;
		const players = parser.getPlayersAtTick(tick);
		for (const player of players) {
			if (player.teamId === 2) {
				redHealth[index] += player.health;
			} else if (player.teamId === 3) {
				blueHealth[index] += player.health;
			}
		}
	}

	const redHealthPath = redHealth.reduce(pathReducer, 'M 0 0');
	const blueHealthPath = blueHealth.reduce(pathReducer, 'M 0 0');

	return (
		<svg className="timeline-background" viewBox={`0 0 ${length} ${9*300}`}
		     preserveAspectRatio="none">
			<path d={redHealthPath} stroke="red" strokeWidth={2}
			      fill="transparent"
			      vectorEffect="non-scaling-stroke" strokeOpacity={0.5}/>
			<path d={blueHealthPath} stroke="blue" strokeWidth={2}
			      fill="transparent" strokeOpacity={0.5}
			      vectorEffect="non-scaling-stroke"/>
		</svg>);
}

function pathReducer(path, y, x) {
	return `${path} L ${x} ${y}`
}
