import {
	Demo, Header, Packet, Player, UserInfo,
	Match
} from 'tf2-demo/build/es6';
import {Point} from './PositionCache';
import {getMapBoundaries} from "../MapBoundries";
import {PlayerCache, CachedPlayer} from "./PlayerCache";
import {BuildingCache, CachedBuilding} from "./BuildingCache";
import {Building} from "tf2-demo/build/Data/Building";
import {PlayerResource} from "tf2-demo/build/es6/Data/PlayerResource";

export {CachedPlayer} from './PlayerCache';

export interface CachedDeath {
	tick: number;
	victim: Player;
	assister: Player|null;
	killer: Player|null;
	weapon: string;
	victimTeam: number;
	assisterTeam: number;
	killerTeam: number;
}

export class Parser {
	buffer: ArrayBuffer;
	demo: Demo;
	header: Header;
	playerCache: PlayerCache;
	entityPlayerReverseMap: {[entityId: string]: number} = {};
	nextMappedPlayer = 0;
	entityPlayerMap: {[playerId: string]: Player} = {};
	ticks: number;
	match: Match;
	startTick = 0;
	deaths: {[tick: string]: CachedDeath[]} = {};
	buildingCache: BuildingCache;

	constructor(buffer: ArrayBuffer) {
		this.buffer = buffer;
		this.demo = new Demo(buffer)
	}

	scaleTick(matchTick: number): number {
		return Math.ceil((matchTick - this.startTick) / 2);
	}

	setTick(tick: number, players: Player[], buildings: {[entityId: string]: Building}, playerRescources: PlayerResource[]) {
		for (const player of players) {
			const playerId = this.getPlayerId(player);
			this.playerCache.setPlayer(tick, playerId, player, playerRescources[player.user.entityId]);
		}
		for (const entityId of Object.keys(buildings)) {
			const building = buildings[entityId];
			if (building.health > 0) {
				this.buildingCache.setBuilding(tick, building, building.builder, building.team);
			}
		}
	}

	cacheData(progressCallback: (progress: number) => void) {
		const parser = this.demo.getParser();
		this.header = parser.readHeader();
		this.match = parser.match;
		while (this.match.world.boundaryMin.x === 0) {
			parser.tick();
		}
		const boundaryOverWrite = getMapBoundaries(this.header.map);
		if (boundaryOverWrite) {
			this.match.world.boundaryMax.x = boundaryOverWrite.boundaryMax.x;
			this.match.world.boundaryMax.y = boundaryOverWrite.boundaryMax.y;
			this.match.world.boundaryMin.x = boundaryOverWrite.boundaryMin.x;
			this.match.world.boundaryMin.y = boundaryOverWrite.boundaryMin.y;
		} else {
			throw new Error(`Map not supported "${this.header.map}".`);
		}

		// skip to >1sec after the first player joined
		while (this.match.players.length < 1) {
			parser.tick();
		}
		for (let i = 0; i < 100; i++) {
			parser.tick();
		}
		this.startTick = this.match.tick;
		this.ticks = Math.ceil((this.header.ticks) / 2); // scale down to 30fps
		this.playerCache = new PlayerCache(this.ticks, this.match.world.boundaryMin);
		this.buildingCache = new BuildingCache(this.ticks, this.match.world.boundaryMin);

		let lastTick = 0;
		const demoParser = this.demo.getParser();
		const match = demoParser.match;
		let lastProgress = 0;
		demoParser.on('packet', (packet: Packet) => {
			const tick = Math.floor((match.tick - this.startTick) / 2);
			const progress = Math.round((tick / this.ticks) * 100);
			if (progress > lastProgress) {
				lastProgress = progress;
				progressCallback(progress);
			}
			if (tick > lastTick) {
				this.setTick(tick, match.players, match.buildings, match.playerResources);
				if (tick > lastTick + 1) {
					// demo skipped ticks, copy/interpolote
					for (let i = lastTick; i < tick; i++) {
						this.setTick(i, match.players, match.buildings, match.playerResources);
					}
				}
				lastTick = tick;
			}
		});
		demoParser.parseBody();
		for (const death of match.deaths) {
			const deathTick = this.scaleTick(death.tick);
			if (!this.deaths[deathTick]) {
				this.deaths[deathTick] = [];
			}
			let killer: Player|null;
			try {
				killer = match.getPlayerByUserId(death.killer);
			} catch (e) {
				killer = null;
			}
			let victim: Player|null = null;
			let assister: Player|null = null;
			try {
				victim = match.getPlayerByUserId(death.victim);
			} catch (e) {
				continue;
			}
			try {
				assister = death.assister ? match.getPlayerByUserId(death.assister) : null;
			} catch (e) {

			}

			const killerId = killer ? this.entityPlayerReverseMap[killer.user.entityId] : null;
			const assisterId = assister ? this.entityPlayerReverseMap[assister.user.entityId] : null;
			const victimId = this.entityPlayerReverseMap[victim.user.entityId];

			this.deaths[deathTick].push({
				tick: deathTick,
				victim: victim,
				killer: killer,
				assister: assister,
				weapon: death.weapon,
				victimTeam: this.playerCache.metaCache.getMeta(victimId, deathTick).teamId,
				assisterTeam: (assisterId) ? this.playerCache.metaCache.getMeta(assisterId, deathTick).teamId : 0,
				killerTeam: (killerId) ? this.playerCache.metaCache.getMeta(killerId, deathTick).teamId : 0
			});
		}
	}

	private getPlayerId(player: Player) {
		if (!this.entityPlayerReverseMap[player.user.entityId]) {
			this.entityPlayerMap[this.nextMappedPlayer] = player;
			this.entityPlayerReverseMap[player.user.entityId] = this.nextMappedPlayer;
			this.nextMappedPlayer++;
		}
		return this.entityPlayerReverseMap[player.user.entityId];
	}

	getPlayersAtTick(tick: number) {
		const players: CachedPlayer[] = [];
		for (let i = 0; i < this.nextMappedPlayer; i++) {
			players.push(this.playerCache.getPlayer(tick, i, this.entityPlayerMap[i].user))
		}
		return players;
	}

	getBuildingAtTick(tick: number): CachedBuilding[] {
		return this.buildingCache.getBuildings(tick);
	}
}
