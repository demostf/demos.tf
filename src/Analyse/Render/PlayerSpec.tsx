import * as React from 'react';
import {PlayerState} from "@demostf/parser-worker";

export interface PlayerSpecProps {
	player: PlayerState;
}

import './PlayerSpec.css';
import {SteamAvatar} from "../../Components/SteamAvatar";

const healthMap = {
	0: 100, //fallback
	1: 125, //scout
	2: 150, //sniper
	3: 200, //soldier,
	4: 175, //demoman,
	5: 150, //medic,
	6: 300, //heavy,
	7: 175, //pyro
	8: 125, //spy
	9: 125, //engineer
};

const classMap = {
	1: "scout",
	2: "sniper",
	3: "soldier",
	4: "demoman",
	5: "medic",
	6: "heavy",
	7: "pyro",
	8: "spy",
	9: "engineer"
};

const classSort = {
	1: 1, //scout
	3: 2, //soldier
	7: 3, //pyro
	4: 4, //demoman
	6: 5, //heavy
	9: 6, //engineer
	5: 7, //medic
	2: 8, //sniper
	8: 9, //spy
};

const teamMap = {
	0: "other",
	1: "spectator",
	2: "red",
	3: "blue",
}

export interface PlayersSpecProps {
	players: PlayerState[];
}

const canUseWebP = (() => {
	const elem = document.createElement('canvas');

	if (!!(elem.getContext && elem.getContext('2d'))) {
		// was able or not to get WebP representation
		return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
	}
	else {
		// very old browser like IE 8, canvas not supported
		return false;
	}
})();

export function PlayersSpec({players}: PlayersSpecProps) {
	const redPlayers = players
		.filter((player) => player.team === 2);
	const bluePlayers = players
		.filter((player) => player.team === 3);
	redPlayers.sort((a, b) => classSort[a.playerClass] - classSort[b.playerClass]);
	bluePlayers.sort((a, b) => classSort[a.playerClass] - classSort[b.playerClass]);

	const redPlayerSpecs = redPlayers
		.map((player, i) => <PlayerSpec key={i} player={player}/>)
		.concat(
			redPlayers
				.filter(player => player.playerClass === 5)
				.map((player, i) => <UberSpec
					key={i + 30}
					team={teamMap[player.team]}
					chargeLevel={player.charge}
					isDeath={player.health < 1}
				/>)
		);
	const bluePlayerSpecs = bluePlayers
		.map((player, i) => <PlayerSpec key={i + 20} player={player}/>).concat(
			bluePlayers
				.filter(player => player.playerClass === 5)
				.map((player, i) => {
					// console.log(player);
					return (<UberSpec
						key={i + 50}
						team={teamMap[player.team]}
						chargeLevel={player.charge}
						isDeath={player.health < 1}
					/>)
				})
		);

	return (<div>
		<div className="redSpecHolder">{redPlayerSpecs}</div>
		<div className="blueSpecHolder">{bluePlayerSpecs}</div>
	</div>);
}

export function PlayerSpec({player}: PlayerSpecProps) {
	const healthPercent = Math.min(100, player.health / healthMap[player.playerClass] * 100);
	const healthStatusClass = (player.health > healthMap[player.playerClass]) ? 'overhealed' : (player.health <= 0 ? 'dead' : '');
	const webpClass = (canUseWebP) ? ' webp' : '';

	return (
		<div
			className={"playerspec " + teamMap[player.team] + " " + healthStatusClass + webpClass}>
			{getPlayerIcon(player)}
			<div className="health-container">
				<div className="healthbar"
					 style={{width: healthPercent + '%'}}/>
				<span className="player-name">{player.info.name}</span>
				<span className="health">{player.health}</span>
			</div>
		</div>
	);
}

function getPlayerIcon(player: PlayerState) {
	if (classMap[player.playerClass]) {
		return <div className={classMap[player.playerClass] + " class-icon"}/>
	} else {
		return <SteamAvatar steamId={player.info.steamId}/>
	}
}

export interface UberSpecProps {
	chargeLevel: number;
	team: string;
	isDeath: boolean;
}

export function UberSpec({chargeLevel, team, isDeath}: UberSpecProps) {
	const healthStatusClass = (isDeath) ? 'dead' : '';
	return (
		<div className={`playerspec uber ${team} ${healthStatusClass}`}>
			<div className={"uber class-icon"}/>
			<div className="health-container">
				<div className="healthbar"
					 style={{width: chargeLevel + '%'}}/>
				<span className="player-name">Charge</span>
				<span className="health">{Math.round(chargeLevel)}</span>
			</div>
		</div>
	);
}
