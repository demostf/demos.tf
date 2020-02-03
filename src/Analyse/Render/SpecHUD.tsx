import * as React from 'react';
// import {PlayersSpec} from './PlayerSpec';
// import {KillFeed} from './KillFeed';
import {AsyncParser} from "../Data/AsyncParser";
import {PlayerState} from "@demostf/parser";

export interface SpecHUDProps {
	tick: number;
	parser: AsyncParser;
	players: PlayerState[];
}

export function SpecHUD({tick, parser, players}: SpecHUDProps) {
	return (<div className="spechud">
		{/*<KillFeed tick={tick} deaths={parser.deaths}/>*/}
		{/*<PlayersSpec players={players}/>*/}
	</div>)
}
