import * as React from 'react';
import {PlayerState, WorldBoundaries} from "@demostf/parser";
import {SVGImage} from './SVGImage';

import './Player.css';

export interface PlayerProp {
	player: PlayerState;
	mapBoundary: WorldBoundaries;
	targetSize: {
		width: number;
		height: number;
	};
	scale: number;
}

const healthMap = {
	0: 100, //fallback
	1: 125,//scout
	2: 150,//sniper
	3: 200,//soldier,
	4: 175,//demoman,
	5: 150,//medic,
	6: 300,//heavy,
	7: 175,//pyro
	8: 125,//spy
	9: 125,//engineer
};

const classMap = {
	0: "empty",
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

export function Player({player, mapBoundary, targetSize, scale}: PlayerProp) {
	const worldWidth = mapBoundary.boundary_max.x - mapBoundary.boundary_min.x;
	const worldHeight = mapBoundary.boundary_max.y - mapBoundary.boundary_min.y;
	const x = player.position.x - mapBoundary.boundary_min.x;
	const y = player.position.y - mapBoundary.boundary_min.y;
	const scaledX = x / worldWidth * targetSize.width;
	const scaledY = (worldHeight - y) / worldHeight * targetSize.height;
	const maxHealth = healthMap[player.playerClass];
	const alpha = player.health / maxHealth;
	const teamColor = (player.team === 3) ? '#a75d50' : '#5b818f';
	const imageOpacity = player.health === 0 ? 0 : (1 + alpha) / 2;

	return <g
		transform={`translate(${scaledX} ${scaledY}) scale(${1 / scale})`}>
		<polygon points="-6,14 0, 16 6,14 0,24" fill="white"
				 opacity={imageOpacity}
				 transform={`rotate(${270 - player.angle})`}/>
		<circle r={16} strokeWidth={1} stroke="white" fill={teamColor}
				opacity={alpha}/>
		{getClassImage(player, imageOpacity)}
	</g>
}

function getClassImage(player: PlayerState, imageOpacity: number) {
	if (!classMap[player.playerClass]) {
		return [];
	}
	const image = require(`../../images/class_icons/${classMap[player.playerClass]}.svg`);
	return <SVGImage href={image}
					 className={"player-icon " + player.team}
					 opacity={imageOpacity}
					 height={32}
					 width={32}
					 transform={`translate(-16 -16)`}/>
}
