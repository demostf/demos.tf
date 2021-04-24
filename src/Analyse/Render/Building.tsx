import * as React from 'react';
import {CachedBuilding} from "../Data/BuildingCache";
import {MapBoundary} from "../Data/PositionCache";
import {SVGImage} from './SVGImage';

import './Player.css';

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
	return require(`../../images/building_icons/${icon}_${team}.png`);
}

export function Building({building, mapBoundary, targetSize, scale}: BuildingProp) {
	const worldWidth = mapBoundary.boundaryMax.x - mapBoundary.boundaryMin.x;
	const worldHeight = mapBoundary.boundaryMax.y - mapBoundary.boundaryMin.y;
	const {x, y} = building.position;
	const scaledX = x / worldWidth * targetSize.width;
	const scaledY = (worldHeight - y) / worldHeight * targetSize.height;
	const maxHealth = healthMap[building.level];
	const alpha = building.health / maxHealth;
	try {
		const image = getIcon(building);

		const angle = (building.angle) ?
			<polygon points="-6,14 0, 16 6,14 0,24" fill="white"
					 transform={`rotate(${270 - building.angle})`}/> : '';

		return <g transform={`translate(${scaledX} ${scaledY}) scale(${1 / scale})`}
				  opacity={alpha}>
			{angle}
			<SVGImage href={image} className={"player-icon"} height={32}
					  width={32}
					  transform={`translate(-16 -16)`}/>
		</g>
	} catch (e) {
		console.log(e);

		return null;
	}
}
