import {ParsedDemo, PlayerState, WorldBoundaries, Header} from "@demostf/parser-worker";
import Worker from "worker-loader!./ParseWorker"
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
			const worker = new Worker(new URL('workerize-loader!./ParseWorker.ts', import.meta.url));
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
					console.log(cachedData.data.length);
					this.world = cachedData.world;
					this.demo = new ParsedDemo(cachedData.playerCount, cachedData.world, cachedData.header, cachedData.data);
					resolve(this.demo);
				}
			}
		});
	}

	getPlayersAtTick(tick: number) {
		const players: PlayerState[] = [];
		for (let i = 0; i < this.demo.playerCount; i++) {
			players.push(this.demo.getPlayer(tick, i));
		}

		return players;
	}
}
