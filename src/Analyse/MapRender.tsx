import * as React from 'react';

import {Header} from "tf2-demo/build/es6";
import {CachedPlayer} from "./Data/Parser";
import {Player as PlayerDot} from './Render/Player';
import {MapBoundary} from './Data/PostionCache';

export interface MapRenderProps {
	header: Header;
	players: CachedPlayer[];
	size: {
		width: number;
		height: number;
	},
	world: MapBoundary
}

import './MapRender.css';

declare const require: {
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

export function MapRender({header, players, size, world}: MapRenderProps) {
	const image = require(`./MapImages/${header.map}.png`) as string;
	const background = `url(${image})`;

	const playerDots = players.filter((player: CachedPlayer) => player.position.x).map((player: CachedPlayer, key) => {
		return <PlayerDot key={key} player={player} mapBoundary={world}
		                  targetSize={size}/>
	});

	return (
		<svg className="map-background" width={size.width} height={size.height}
		     style={{backgroundImage:background}}>
			{playerDots}
		</svg>
	);
}
