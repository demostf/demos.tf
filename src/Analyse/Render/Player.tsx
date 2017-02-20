import * as React from 'react';
import {CachedPlayer} from "../Data/Parser";
import {Point, MapBoundary} from "../Data/PositionCache";

import './Player.css';

export interface PlayerProp {
	player: CachedPlayer;
	mapBoundary: MapBoundary;
	targetSize: {
		width: number;
		height: number;
	};
	scale: number;
}

const healthMap = {
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
	// const x = (player.position.x - mapBoundary.boundaryMin.x);
	// const y = (player.position.y - mapBoundary.boundaryMin.y);
	const worldWidth = mapBoundary.boundaryMax.x - mapBoundary.boundaryMin.x;
	const {x, y}= player.position;
	const scaledX = (worldWidth - x) / (worldWidth) * targetSize.width;
	const scaledY = y / (mapBoundary.boundaryMax.y - mapBoundary.boundaryMin.y) * targetSize.height;
	const maxHealth = healthMap[player.classId];
	const alpha = player.health / maxHealth;
	const image = require(`../../images/class_icons/${classMap[player.classId]}_${player.team}.png`) as string;

	return <g transform={`translate(${scaledX} ${scaledY}) scale(${1/scale})`}
	          opacity={alpha}>
		<polygon points="-6,14 0, 16 6,14 0,24" fill="white" transform={`rotate(${90 - player.viewAngle})`}/>
		<image href={image} className={"player-icon " + player.team} height={32}
		       width={32}
		       transform={`translate(-16 -16)`}/>
	</g>
}
