import * as React from 'react';
import {CachedPlayer} from "../Data/Parser";
import {Point, MapBoundary} from "../Data/PositionCache";

import './Player.css';
import {CachedBuilding} from "../Data/BuildingCache";

export interface BuildingProp {
	building: CachedBuilding;
	mapBoundary: MapBoundary;
	targetSize: {
		width: number;
		height: number;
	};
	scale: number;
}

const healthMap = [0, 150, 180, 216];

function getIcon(building: CachedBuilding) {
	let icon;
	switch (building.type) {
		case 0:
			icon = `sentry_${building.level}`;
			break;
		case 1:
			icon = 'dispenser';
			break;
		case 2:
			icon = 'tele_entrance';
			break;
		case 3:
			icon = 'tele_exit';
			break;
	}
	const team = building.team === 2 ? 'red' : 'blue';
	return require(`../../images/building_icons/${icon}_${team}.png`) as string;
}

export function Building({building, mapBoundary, targetSize, scale}: BuildingProp) {
	const worldWidth = mapBoundary.boundaryMax.x - mapBoundary.boundaryMin.x;
	const {x, y}= building.position;
	const scaledX = (worldWidth - x) / (worldWidth) * targetSize.width;
	const scaledY = y / (mapBoundary.boundaryMax.y - mapBoundary.boundaryMin.y) * targetSize.height;
	const maxHealth = healthMap[building.level];
	const alpha = building.health / maxHealth;
	const image = getIcon(building);

	return <g transform={`translate(${scaledX} ${scaledY}) scale(${1/scale})`}
	          opacity={alpha}>
		<image href={image} className={"player-icon"} height={32}
		       width={32}
		       transform={`translate(-16 -16)`}/>
	</g>
}
