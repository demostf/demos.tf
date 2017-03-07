import {PositionCache, Point} from './PositionCache';
import {Player, UserInfo} from 'tf2-demo/build/es6';
import {ViewAngleCache} from "./ViewAngleCache";
import {PlayerMetaCache} from "./PlayerMetaCache";
import {HealthCache} from "./HealthCache";
import {LifeState} from "tf2-demo/build/Data/Player";

export class CachedPlayer {
	position: Point;
	user: UserInfo;
	health: number;
	teamId: number;
	classId: number;
	team: string;
	viewAngle: number;
}

export class PlayerCache {
	tickCount: number;
	positionCache: PositionCache;
	healthCache: HealthCache;
	metaCache: PlayerMetaCache;
	viewAngleCache: ViewAngleCache;

	constructor(tickCount: number, positionOffset: Point) {
		this.positionCache = new PositionCache(tickCount, positionOffset);
		this.healthCache = new HealthCache(tickCount);
		this.metaCache = new PlayerMetaCache(tickCount);
		this.viewAngleCache = new ViewAngleCache(tickCount);
	}

	setPlayer(tick: number, playerId: number, player: Player) {
		this.positionCache.setPosition(playerId, tick, player.position);
		this.healthCache.set(playerId, tick, player.lifeState === LifeState.ALIVE ? player.health : 0);
		this.metaCache.setMeta(playerId, tick, {
			classId: player.classId,
			teamId: player.team
		});
		this.viewAngleCache.set(playerId, tick, player.viewAngle);
	}

	getPlayer(tick: number, playerId: number, user: UserInfo): CachedPlayer {
		const meta = this.metaCache.getMeta(playerId, tick);
		const team = (meta.teamId === 2) ? 'red' : (meta.teamId === 3 ? 'blue' : '');
		return {
			position: this.positionCache.getPosition(playerId, tick),
			user: user,
			health: this.healthCache.get(playerId, tick),
			teamId: meta.teamId,
			classId: meta.classId,
			team,
			viewAngle: this.viewAngleCache.get(playerId, tick)
		};
	}

	static rehydrate(data: PlayerCache) {
		PositionCache.rehydrate(data.positionCache);
		HealthCache.rehydrate(data.healthCache);
		PlayerMetaCache.rehydrate(data.metaCache);
		ViewAngleCache.rehydrate(data.viewAngleCache);

		Object.setPrototypeOf(data, PlayerCache.prototype);
	}
}
