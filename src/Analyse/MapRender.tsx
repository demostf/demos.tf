import * as React from 'react';

import {Player as PlayerDot} from './Render/Player';
// import {Building as BuildingDot} from './Render/Building';
import {findMapAlias} from './MapBoundries';
import {PlayerState, Header, WorldBoundaries} from "@demostf/parser";

export interface MapRenderProps {
	header: Header;
	players: PlayerState[];
	size: {
		width: number;
		height: number;
	},
	world: WorldBoundaries;
	scale: number;
}

import './MapRender.css';

declare const require: {
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

function canUseWebP() {
	const elem = document.createElement('canvas');

	if (!!(elem.getContext && elem.getContext('2d'))) {
		// was able or not to get WebP representation
		return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
	}
	else {
		// very old browser like IE 8, canvas not supported
		return false;
	}
}

export function MapRender({header, players, size, world, scale}: MapRenderProps) {
	const mapAlias = findMapAlias(header.map);
	const image = (canUseWebP()) ?
		((require(`../images/leveloverview/dist/${mapAlias}.webp`) as any)) :
		((require(`../images/leveloverview/dist/${mapAlias}.jpg`) as any));
	const background = `url(${image})`;

	const playerDots = players
		.filter((player: PlayerState) => player.position.x)
		.map((player: PlayerState, key) => {
			return <PlayerDot key={key} player={player} mapBoundary={world}
			                  targetSize={size} scale={scale}/>
		});

	// const buildingDots = buildings
	// 	.filter((building: CachedBuilding) => building.position.x)
	// 	.map((building: CachedBuilding, key) => {
	// 		return <BuildingDot key={100 + key} building={building}
	// 		                    mapBoundary={world}
	// 		                    targetSize={size} scale={scale}/>
	// 	});

	return (
		<svg className="map-background" width={size.width} height={size.height}
		     style={{backgroundImage: background}}>
			{playerDots}
			{/*{buildingDots}*/}
		</svg>
	);
}
