import * as React from 'react';
import {MapBackground} from './MapBackground';
import {Demo, Header} from 'tf2-demo/build/es6';
import {MapContainer} from "./MapContainer";

export interface AnalyseProps {
	demo: Demo;
	header: Header;
}

export function Analyser({demo, header}:AnalyseProps) {
	return (
		<div>
			<h1>{header.server}</h1>
			<MapContainer>
				<MapBackground map={header.map}/>
			</MapContainer>
		</div>
	);
}
