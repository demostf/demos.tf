// import * as React from 'react';
// import {CachedPlayer} from "../Data/Parser";
//
// export interface PlayerSpecProps {
// 	player: CachedPlayer;
// }
//
// import './PlayerSpec.css';
// import {SteamAvatar} from "../../Components/SteamAvatar";
//
// const healthMap = {
// 	0: 100,//fallback
// 	1: 125,//scout
// 	2: 150,//sniper
// 	3: 200,//soldier,
// 	4: 175,//demoman,
// 	5: 150,//medic,
// 	6: 300,//heavy,
// 	7: 175,//pyro
// 	8: 125,//spy
// 	9: 125,//engineer
// };
//
// const classMap = {
// 	1: "scout",
// 	2: "sniper",
// 	3: "soldier",
// 	4: "demoman",
// 	5: "medic",
// 	6: "heavy",
// 	7: "pyro",
// 	8: "spy",
// 	9: "engineer"
// };
//
// export interface PlayersSpecProps {
// 	players: CachedPlayer[];
// }
//
// const canUseWebP = (() => {
// 	const elem = document.createElement('canvas');
//
// 	if (!!(elem.getContext && elem.getContext('2d'))) {
// 		// was able or not to get WebP representation
// 		return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
// 	}
// 	else {
// 		// very old browser like IE 8, canvas not supported
// 		return false;
// 	}
// })();
//
// export function PlayersSpec({players}: PlayersSpecProps) {
// 	const redPlayers = players
// 		.filter((player) => player.teamId === 2);
// 	const bluePlayers = players
// 		.filter((player) => player.teamId === 3);
//
// 	const redPlayerSpecs = redPlayers
// 		.map((player, i) => <PlayerSpec key={i} player={player}/>)
// 		.concat(
// 			redPlayers
// 				.filter(player => player.chargeLevel !== null)
// 				.map((player, i) => <UberSpec
// 					key={i + 20}
// 					team={player.team}
// 					chargeLevel={player.chargeLevel !== null ? player.chargeLevel : 0}
// 					isDeath={player.health < 1}
// 				/>)
// 		);
// 	const bluePlayerSpecs = bluePlayers
// 		.map((player, i) => <PlayerSpec key={i} player={player}/>).concat(
// 			bluePlayers
// 				.filter(player => player.chargeLevel !== null)
// 				.map((player, i) => <UberSpec
// 					key={i + 20}
// 					team={player.team}
// 					chargeLevel={player.chargeLevel !== null ? player.chargeLevel : 0}
// 					isDeath={player.health < 1}
// 				/>)
// 		);
//
// 	return (<div>
// 		<div className="redSpecHolder">{redPlayerSpecs}</div>
// 		<div className="blueSpecHolder">{bluePlayerSpecs}</div>
// 	</div>);
// }
//
// export function PlayerSpec({player}: PlayerSpecProps) {
// 	const healthPercent = Math.min(100, player.health / healthMap[player.classId] * 100);
// 	const healthStatusClass = (player.health > healthMap[player.classId]) ? 'overhealed' : (player.health <= 0 ? 'dead' : '');
// 	const webpClass = (canUseWebP) ? ' webp' : '';
//
// 	return (
// 		<div
// 			className={"playerspec " + player.team + " " + healthStatusClass + webpClass}>
// 			{getPlayerIcon(player)}
// 			<div className="health-container">
// 				<div className="healthbar"
// 					 style={{width: healthPercent + '%'}}/>
// 				<span className="player-name">{player.user.name}</span>
// 				<span className="health">{player.health}</span>
// 			</div>
// 		</div>
// 	);
// }
//
// function getPlayerIcon(player: CachedPlayer) {
// 	if (classMap[player.classId]) {
// 		return <div className={classMap[player.classId] + " class-icon"}/>
// 	} else {
// 		return <SteamAvatar steamId={player.user.steamId}/>
// 	}
// }
//
// export interface UberSpecProps {
// 	chargeLevel: number;
// 	team: string;
// 	isDeath: boolean;
// }
//
// export function UberSpec({chargeLevel, team, isDeath}: UberSpecProps) {
// 	const healthStatusClass = (isDeath) ? 'dead' : '';
// 	return (
// 		<div className={`playerspec uber ${team} ${healthStatusClass}`}>
// 			<div className={"uber class-icon"}/>
// 			<div className="health-container">
// 				<div className="healthbar"
// 					 style={{width: chargeLevel + '%'}}/>
// 				<span className="player-name">Charge</span>
// 				<span className="health">{Math.round(chargeLevel)}</span>
// 			</div>
// 		</div>
// 	);
// }
