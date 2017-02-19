import * as React from 'react';
import {Parser} from "../Data/Parser";

export interface TimelineProps {
	parser: Parser
	tick: number
}

export function Timeline({parser, tick}:TimelineProps) {
	const tickPercent = (tick / parser.ticks) * 100;

	return (<div className="timeline">
		<TimeLineBackground parser={parser}/>
		<svg className="timeline-progress" viewBox="0 0 100 100"
		     preserveAspectRatio="none">
			<line x1={tickPercent} y1={0} x2={tickPercent} y2={100}
			      stroke="black"
			      vectorEffect="non-scaling-stroke"/>
		</svg>
	</div>);
}

import './Timeline.css';

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
