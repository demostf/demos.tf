import {
	Demo, Header, Packet, Player, UserInfo,
	Match
} from 'tf2-demo/build/es6';
import {PostionCache, Point} from './PostionCache';
import {getMapBoundaries} from "../MapBoundries";

export class CachedPlayer {
	position: Point;
	user: UserInfo;
}

export class Parser {
	demo: Demo;
	header: Header;
	positionCache: PostionCache;
	entityPlayerReverseMap: {[entityId: string]: number} = {};
	nextMappedPlayer = 0;
	entityPlayerMap: {[playerId: string]: Player} = {};
	ticks: number;
	match: Match;
	startTick = 0;

	constructor(demo: Demo, head: Header) {
		this.demo = demo;
		this.header = head;
		const parser = this.demo.getParser();
		this.match = parser.match;
		while (this.match.world.boundaryMin.x === 0) {
			parser.tick();
		}
		const boundaryOverWrite = getMapBoundaries(this.header.map);
		if (boundaryOverWrite) {
			this.match.world.boundaryMax.x = boundaryOverWrite.boundaryMax.x;
			this.match.world.boundaryMax.y = boundaryOverWrite.boundaryMax.y;
			this.match.world.boundaryMin.x = boundaryOverWrite.boundaryMin.x;
			this.match.world.boundaryMax.y = boundaryOverWrite.boundaryMax.y;
		}
		this.startTick = this.match.tick;
		this.ticks = Math.ceil((head.ticks) / 2); // scale down to 30fps
		this.positionCache = new PostionCache(20, this.ticks, this.match.world.boundaryMin); // 20 players "should work in most cases"
	}

	cacheData() {
		let lastTick = 0;
		const demoParser = this.demo.getParser();
		const match = demoParser.match;
		demoParser.on('packet', (packet: Packet) => {
			const tick = Math.floor((match.tick - this.startTick) / 2);
			if (tick > lastTick) {
				lastTick = tick;
				for (const player of match.players) {
					this.positionCache.setPostion(this.getPlayerId(player), tick, player.position);
				}
			}
		});
		demoParser.parseBody();
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
			players.push({
				position: this.positionCache.getPostion(i, tick),
				user: this.entityPlayerMap[i].user
			});
		}
		return players;
	}
}
