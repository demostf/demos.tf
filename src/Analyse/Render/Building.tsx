import * as React from 'react';
import {BuildingState, WorldBoundaries, BuildingType, Team} from "@demostf/parser-worker";
import {SVGImage} from './SVGImage';

import './Player.css';

export interface BuildingProp {
	building: BuildingState;
	mapBoundary: WorldBoundaries;
	targetSize: {
		width: number;
		height: number;
	};
	scale: number;
}

const healthMap = [0, 150, 180, 216];

function getBuildingType(type: BuildingType) {
	switch (type) {
		case BuildingType.TeleporterEntrance:
			return 'tele_entrance';
		case BuildingType.TeleporterExit:
			return 'tele_exit';
		case BuildingType.Dispenser:
			return 'dispenser';
		case BuildingType.Level1Sentry:
			return 'sentry_1';
		case BuildingType.Level2Sentry:
			return 'sentry_2';
		case BuildingType.Level3Sentry:
			return 'sentry_3';
		case BuildingType.MiniSentry:
			return 'sentry_1';
		default:
			return 'unknown';
	}
}

function getIcon(building: BuildingState) {
	const icon = getBuildingType(building.buildingType);
	const team = building.team === Team.Red ? 'red' : 'blue';
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
