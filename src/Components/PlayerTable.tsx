import * as React from 'react';
import {Link} from 'react-router-dom';

import './PlayerTable.css';
import './ClassIcons.css';
import {Player} from "../Providers/DemoProvider";

function getPlayerPairs(players: Player[]) {
	const classes: {
		[className: string]: {
			red: Player[];
			blue: Player[];
		}
	} = {
		Unknown: {red: [], blue: []},
		scout: {red: [], blue: []},
		soldier: {red: [], blue: []},
		pyro: {red: [], blue: []},
		demoman: {red: [], blue: []},
		heavyweapons: {red: [], blue: []},
		engineer: {red: [], blue: []},
		medic: {red: [], blue: []},
		sniper: {red: [], blue: []},
		spy: {red: [], blue: []}
	};

	for (const player of players) {
		if (classes[player.class]) {
			classes[player.class][player.team].push(player);
		}
	}
	const sortedPlayers: {
		className: string;
		red: Player;
		blue: Player;
	}[] = [];
	const nullPlayer = {
		kills: 0,
		assists: 0,
		deaths: 0,
		name: '',
		steamid: ''
	};
	for (const className in classes) {
		if (classes.hasOwnProperty(className)) {
			const classPlayers = classes[className || 'Unknown'];
			const length = Math.max(classPlayers.red.length, classPlayers.blue.length);
			for (let j = 0; j < length; j++) {
				sortedPlayers.push({
					red: classPlayers.red[j] || nullPlayer,
					blue: classPlayers.blue[j] || nullPlayer,
					className: classPlayers.red[j] ? classPlayers.red[j].class : classPlayers.blue[j].class
				});
			}
		}
	}
	return sortedPlayers;
}

export interface PlayerTableProps {
	players: Player[];
	highlightUsers: string[];
}

export function PlayerTable(props: PlayerTableProps) {
	const playerPairs = getPlayerPairs(props.players);
	const rows = playerPairs.map((pair, i) => {
		const highlightRed = props.highlightUsers.includes(pair.red.steamid);
		const highlightBlue = props.highlightUsers.includes(pair.blue.steamid);
		return (
			<tr key={i} className={(highlightRed ? 'highlight-red ' : '') + (highlightBlue ? 'highlight-blue' : '')}>
				<td className="team red"/>
				<td className="name red">
					{(pair.red) ? <Link
						to={"/profiles/" + pair.red.steamid}>{pair.red.name}</Link> : ''}
				</td>
				<td className="stat red">{pair.red.kills || '0'}</td>
				<td className="stat red">{pair.red.assists || '0'}</td>
				<td className="stat red">{pair.red.deaths || '0'}</td>
				<td className="class">
					<span className={'class-icon ' + pair.className}/>
				</td>
				<td className="stat blue">{pair.blue.deaths || '0'}</td>
				<td className="stat blue">{pair.blue.assists || '0'}</td>
				<td className="stat blue">{pair.blue.kills || '0'}</td>
				<td className="name blue">
					{(pair.blue.steamid) ? <Link
						to={"/profiles/" + pair.blue.steamid}>{pair.blue.name}</Link> : ''}
				</td>
				<td className="team blue"/>
			</tr>
		)
	});

	return (
		<table className="players">
			<thead>
				<tr>
					<th className="team red"/>
					<th className="name red">Name</th>
					<th className="stat red">K</th>
					<th className="stat red">A</th>
					<th className="stat red">D</th>
					<th className="class"/>
					<th className="stat blue">D</th>
					<th className="stat blue">A</th>
					<th className="stat blue">K</th>
					<th className="name blue">Name</th>
					<th className="team blue"/>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}
