import * as React from 'react';
import {fuzzyTime} from '../FuzzyTime';
import {Duration} from './Duration'
import {Link} from 'react-router-dom';
import {DemoInfo} from "../Providers/DemoProvider";

export interface DemoRowProps extends DemoInfo {
	i: number;
}

export function DemoRow(props: DemoRowProps) {
	let formatName = 'Other';
	if (props.map.indexOf('bball') !== -1 || props.map.indexOf('ballin') !== -1) {
		formatName = 'BBall';
	} else if (props.map.indexOf('ultiduo') !== -1) {
		formatName = 'Ultiduo';
	} else if (props.playerCount <= 19 && props.playerCount >= 17) {
		formatName = 'HL';
	} else if (props.playerCount <= 13 && props.playerCount >= 11) {
		formatName = '6v6';
	} else if (props.playerCount <= 9 && props.playerCount >= 7) {
		formatName = '4v4';
	} else if (props.playerCount === 6) {
		formatName = '3v3';
	} else if (props.playerCount === 4) {
		formatName = '2v2';
	} else if (props.playerCount === 2) {
		formatName = '1v1';
	}
	return (
		<tr key={props.i}
		    className={((props.i % 2 === 0) ? 'even': 'odd')}>
			<td className="title">
				<Link to={'/' + props.id}>
					{props.server} - {props.red}
					&nbsp;vs&nbsp;{props.blue}
				</Link>
			</td>
			<td className="format">{formatName}</td>
			<td className="map">{props.map}</td>
			<td className="duration"><Duration
				duration={props.duration}/></td>
			<td className="date">
				{fuzzyTime(props.time)}
			</td>
		</tr>
	);
}
