import * as React from 'react';
import {Parser, CachedPlayer} from "../Data/Parser";
import {PlayersSpec} from './PlayerSpec';
import {KillFeed} from './KillFeed';
import {AsyncParser} from "../Data/AsyncParser";

export interface SpecHUDProps {
	tick: number;
	parser: AsyncParser;
	players: CachedPlayer[];
}

export function SpecHUD({tick, parser, players}: SpecHUDProps) {
	return (<div className="spechud">
		<KillFeed tick={tick} deaths={parser.deaths}/>
		<PlayersSpec players={players}/>
	</div>)
}
