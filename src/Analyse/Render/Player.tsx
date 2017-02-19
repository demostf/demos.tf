import * as React from 'react';
import {CachedPlayer} from "../Data/Parser";
import {Point, MapBoundary} from "../Data/PostionCache";


export interface PlayerProp {
	player: CachedPlayer;
	mapBoundary: MapBoundary;
	targetSize: {
		width: number;
		height: number;
	}
}

export function Player({player, mapBoundary, targetSize}: PlayerProp) {
	// const x = (player.position.x - mapBoundary.boundaryMin.x);
	// const y = (player.position.y - mapBoundary.boundaryMin.y);
	const worldWidth = mapBoundary.boundaryMax.x - mapBoundary.boundaryMin.x;
	const {x, y}= player.position;
	const scaledX = (worldWidth - x) / (worldWidth) * targetSize.width;
	const scaledY = y / (mapBoundary.boundaryMax.y - mapBoundary.boundaryMin.y) * targetSize.height;

	return <circle cx={scaledX} cy={scaledY} r={75}
	               fill={player.user.team}/>
}
