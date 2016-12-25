'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';

require('./PlayerTable.css');
require('./ClassIcons.css');

export class PlayerTable extends Component {
	getPlayerPairs (players) {
		var classes = {
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

		for (var player of players) {
			classes[player.class][player.team].push(player);
		}
		var sortedPlayers = [];
		for (var className in classes) {
			if (classes.hasOwnProperty(className)) {
				var classPlayers = classes[className];
				var length = Math.max(classPlayers.red.length, classPlayers.blue.length);
				for (var j = 0; j < length; j++) {
					sortedPlayers.push({
						red: classPlayers.red[j] || {},
						blue: classPlayers.blue[j] || {},
						className: classPlayers.red[j] ? classPlayers.red[j].class : classPlayers.blue[j].class
					});
				}
			}
		}
		return sortedPlayers;
	}

	render () {
		var playerPairs = this.getPlayerPairs(this.props.players);
		var rows = playerPairs.map((pair, i) => {
			return (
				<tr key={i}>
					<td className="team red"/>
					<td className="name red">
						{(pair.red) ? <Link
							to={"/profiles/"+pair.red.steamid}>{pair.red.name}</Link> : ''}
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
						{(pair.blue) ? <Link
							to={"/profiles/"+pair.blue.steamid}>{pair.blue.name}</Link> : ''}
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
}
