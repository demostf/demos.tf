import * as React from 'react';

import {Header} from "tf2-demo/build/es6";
import {CachedPlayer} from "./Data/Parser";
import {Player as PlayerDot} from './Render/Player';
import {MapBoundary} from './Data/PositionCache';
import {findMapAlias} from './MapBoundries';

export interface MapRenderProps {
	header: Header;
	players: CachedPlayer[];
	size: {
		width: number;
		height: number;
	},
	world: MapBoundary;
	scale: number;
}

import './MapRender.css';

declare const require: {
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

export function MapRender({header, players, size, world, scale}: MapRenderProps) {
	const mapAlias = findMapAlias(header.map);
	const image = require(`./MapImages/${mapAlias}.png`) as string;
	const background = `url(${image})`;

	const playerDots = players
		.filter((player: CachedPlayer) => player.position.x && (player.teamId === 2 || player.teamId === 3))
		.map((player: CachedPlayer, key) => {
			return <PlayerDot key={key} player={player} mapBoundary={world}
			                  targetSize={size} scale={scale}/>
		});

	return (
		<svg className="map-background" width={size.width} height={size.height}
		     style={{backgroundImage:background}}>
			{playerDots}
		</svg>
	);
}
