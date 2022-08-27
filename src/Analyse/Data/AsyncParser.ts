import {ParsedDemo, PlayerState, WorldBoundaries, Header, Kill, BuildingState} from "@demostf/parser-worker";
import {getMapBoundaries} from "../MapBoundries";

export class AsyncParser {
	buffer: ArrayBuffer;
	demo: ParsedDemo;
	world: WorldBoundaries;
	progressCallback: (progress: number) => void;

	constructor(buffer: ArrayBuffer, progressCallback: (progress: number) => void) {
		this.buffer = buffer;
		this.progressCallback = progressCallback;
	}

	cache(): Promise<ParsedDemo> {
		return new Promise((resolve, reject) => {
			const worker = new Worker(new URL('./ParseWorker.ts', import.meta.url));
			worker.postMessage({
				buffer: this.buffer
			}, [this.buffer]);
			worker.onmessage = (event) => {
				if (event.data.error) {
					reject(event.data.error);
					return;
				} else if (event.data.progress) {
					this.progressCallback(event.data.progress);
					return;
				} else if (event.data.demo) {
					const cachedData: ParsedDemo = event.data.demo;
					console.log(`packed data: ${(cachedData.data.length / (1024 * 1024)).toFixed(1)}MB`);
					this.world = cachedData.world;
					this.demo = new ParsedDemo(cachedData.playerCount, cachedData.buildingCount, cachedData.world, cachedData.header, cachedData.data, cachedData.kills, cachedData.playerInfo, cachedData.tickCount);
					resolve(this.demo);
				}
			}
		});
	}

	getPlayersAtTick(tick: number): PlayerState[] {
		const players: PlayerState[] = [];
		for (let i = 0; i < this.demo.playerCount; i++) {
			players.push(this.demo.getPlayer(tick, i));
		}

		return players;
	}

	getBuildingsAtTick(tick: number): BuildingState[] {
		const buildings: BuildingState[] = [];
		for (let i = 0; i < this.demo.buildingCount; i++) {
			const building = this.demo.getBuilding(tick, i);
			if (building.health > 0) {
				buildings.push(building);
			}
		}

		return buildings;
	}

	getKills(): Kill[] {
		return this.demo.kills
	}
}
