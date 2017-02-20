import * as React from 'react';
import {CachedPlayer} from "../Data/Parser";
import {Point, MapBoundary} from "../Data/PositionCache";


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

export function Player({player, mapBoundary, targetSize, scale}: PlayerProp) {
	// const x = (player.position.x - mapBoundary.boundaryMin.x);
	// const y = (player.position.y - mapBoundary.boundaryMin.y);
	const worldWidth = mapBoundary.boundaryMax.x - mapBoundary.boundaryMin.x;
	const {x, y}= player.position;
	const scaledX = (worldWidth - x) / (worldWidth) * targetSize.width;
	const scaledY = y / (mapBoundary.boundaryMax.y - mapBoundary.boundaryMin.y) * targetSize.height;
	const maxHealth = healthMap[player.classId];
	const alpha = player.health / maxHealth;

	return <circle cx={scaledX} cy={scaledY} r={10 / scale} fillOpacity={alpha}
	               fill={player.team}/>
}
