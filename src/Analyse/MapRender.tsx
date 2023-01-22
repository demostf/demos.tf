import * as React from 'react';

import {Player as PlayerDot} from './Render/Player';
import {Building as BuildingDot} from './Render/Building';
import {findMapAlias} from './MapBoundries';
import {PlayerState, Header, WorldBoundaries, BuildingState} from "@demostf/parser-worker";

export interface MapRenderProps {
	header: Header;
	players: PlayerState[];
	buildings: BuildingState[];
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

export function MapRender({header, players, size, world, scale, buildings}: MapRenderProps) {
	const mapAlias = findMapAlias(header.map);
	const image = (require(`../images/leveloverview/dist/${mapAlias}.webp`) as any);
	const background = `url(${image})`;

	const playerDots = players
		.filter((player: PlayerState) => player.health)
		.map((player: PlayerState, key) => {
			return <PlayerDot key={key} player={player} mapBoundary={world}
			                  targetSize={size} scale={scale} />
		});

	const buildingDots = buildings
		.filter((building: PlayerState) => building.position.x)
		.map((building: PlayerState, key) => {
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
