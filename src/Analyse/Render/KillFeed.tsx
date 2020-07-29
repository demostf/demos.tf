import * as React from 'react';

import './KillFeed.css';
import {CachedDeath} from "../Data/Parser";
import {killAlias} from "./killAlias";

export interface KillFeedProps {
	deaths: {[tick: string]: CachedDeath[]}
	tick: number;
}

export function KillFeed({deaths, tick}:KillFeedProps) {
	let relevantKills: CachedDeath[] = [];
	for (const deathTickKey in deaths) {
		const deathTick = parseInt(deathTickKey, 10);
		if (deaths.hasOwnProperty(deathTickKey) && deathTick <= tick && deathTick >= (tick - 30 * 10)) {
			relevantKills = relevantKills.concat(deaths[deathTickKey]);
		}
	}

	return <div className="killfeed">
		{relevantKills.map((kill, i) => <KillFeedItem key={i} death={kill}/>)}
	</div>
}

const teamMap = {
	2: 'red',
	3: 'blue'
};

export function KillFeedItem({death}:{death: CachedDeath}) {
	const alias = killAlias[death.weapon] ? killAlias[death.weapon] : death.weapon;
	let killIcon;
	try {
		killIcon = require(`../../images/kill_icons/${alias}.png`).default;
	} catch (e) {
		console.log(alias);
		killIcon = require(`../../images/kill_icons/skull.png`).default;
	}

	return <div className="kill">
		{(death.killer && death.killer !== death.victim) ?
			<span className={"player " + teamMap[death.killerTeam]}>
				{death.killer.user.name}
				</span> : ''}
		{(death.assister && death.assister !== death.victim) ?
			<span className={teamMap[death.assisterTeam]}>﹢</span> : ''}
		{(death.assister && death.assister !== death.victim) ?
			(<span className={"player " + teamMap[death.assisterTeam]}>
				{death.assister.user.name}
				</span>) : ''}
		<img src={killIcon} className={`kill-icon ${death.weapon}`}/>
		<span className={"player " + teamMap[death.victimTeam]}>
			{death.victim.user.name}
			</span>
	</div>
}
