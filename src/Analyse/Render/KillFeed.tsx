import * as React from 'react';

import './KillFeed.css';
import {Kill, PlayerState} from "@demostf/parser-worker";
import {killAlias} from "./killAlias";

export interface KillFeedProps {
	kills: Kill[],
	tick: number;
	players: PlayerState[];
}

export function KillFeed({kills, tick, players}: KillFeedProps) {
	let relevantKills: Kill[] = kills.filter(kill => kill.tick <= tick && kill.tick >= (tick - 30 * 10));

	return <div className="killfeed">
		{relevantKills.map((kill, i) => <KillFeedItem key={i} kill={kill} players={players}/>)}
	</div>
}

const teamMap = {
	2: 'red',
	3: 'blue'
};

export function KillFeedItem({kill, players}: { kill: Kill, players: PlayerState[] }) {
	const alias = killAlias[kill.weapon] ? killAlias[kill.weapon] : kill.weapon;
	const attacker = getPlayer(players, kill.attacker);
	const assister = getPlayer(players, kill.assister);
	const victim = getPlayer(players, kill.victim);
	let killIcon;
	try {
		killIcon = require(`../../images/kill_icons/${alias}.png`);
	} catch (e) {
		console.log(alias);
		killIcon = require(`../../images/kill_icons/skull.png`);
	}

	return <div className="kill">
		{(attacker && kill.attacker !== kill.victim) ?
			<span className={"player " + teamMap[attacker.team]}>
				{attacker.info.name}
				</span> : ''}
		{(assister && kill.assister !== kill.victim) ?
			<span className={teamMap[attacker.team]}>﹢</span> : ''}
		{(assister && kill.assister !== kill.victim) ?
			(<span className={"player " + teamMap[assister.team]}>
				{assister.info.name}
				</span>) : ''}
		<img src={killIcon} className={`kill-icon ${kill.weapon}`}/>
		<span className={"player " + teamMap[victim.team]}>
			{victim.info.name}
			</span>
	</div>
}

function getPlayer(players: PlayerState[], entityId: number): PlayerState {
	return players.find(player => player.info.userId == entityId);
}
