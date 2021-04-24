import * as React from 'react';

import {Header} from "@demostf/demo.js";
import {CachedPlayer} from "./Data/Parser";
import {Player as PlayerDot} from './Render/Player';
import {Building as BuildingDot} from './Render/Building';
import {MapBoundary} from './Data/PositionCache';
import {findMapAlias} from './MapBoundries';

export interface MapRenderProps {
	header: Header;
	players: CachedPlayer[];
	buildings: CachedBuilding[];
	size: {
		width: number;
		height: number;
	},
	world: MapBoundary;
	scale: number;
}

import './MapRender.css';
import {CachedBuilding} from "./Data/BuildingCache";

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

export function MapRender({header, players, size, world, scale, buildings}: MapRenderProps) {
	const mapAlias = findMapAlias(header.map);
	const image = (canUseWebP()) ?
		((require(`../images/leveloverview/dist/${mapAlias}.webp`) as any)) :
		((require(`../images/leveloverview/dist/${mapAlias}.jpg`) as any));
	const background = `url(${image})`;

	const playerDots = players
		.filter((player: CachedPlayer) => player.position.x)
		.map((player: CachedPlayer, key) => {
			return <PlayerDot key={key} player={player} mapBoundary={world}
			                  targetSize={size} scale={scale}/>
		});

	const buildingDots = buildings
		.filter((building: CachedBuilding) => building.position.x)
		.map((building: CachedBuilding, key) => {
			return <BuildingDot key={100 + key} building={building}
			                    mapBoundary={world}
			                    targetSize={size} scale={scale}/>
		});

	return (
		<svg className="map-background" width={size.width} height={size.height}
		     style={{backgroundImage: background}}>
			{playerDots}
			{buildingDots}
		</svg>
	);
}
