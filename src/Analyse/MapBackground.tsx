import * as React from 'react';

export interface MapBackgroundProps {
	map: string;
}

import './MapBackground.css';

declare const require: {
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

export function MapBackground({map}:MapBackgroundProps) {
	const image = require(`./MapImages/${map}.png`) as string;
	const background = `url(${image})`;
	console.log(background);

	return <div className="map-background" style={{backgroundImage:background, color:'red'}}/>;
}
