import * as React from 'react';
import {PlayersSpec} from './PlayerSpec';
import {KillFeed} from './KillFeed';
import {AsyncParser} from "../Data/AsyncParser";
import {PlayerState, Kill} from "@demostf/parser-worker";

export interface SpecHUDProps {
	tick: number;
	parser: AsyncParser;
	players: PlayerState[];
	kills: Kill[]
}

export function SpecHUD({tick, parser, players, kills}: SpecHUDProps) {
	return (<div className="spechud">
		<KillFeed tick={tick} kills={kills} players={players}/>
		<PlayersSpec players={players}/>
	</div>)
}

