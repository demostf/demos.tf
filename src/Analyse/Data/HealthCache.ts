import {DataCache} from "./DataCache";

export class HealthCache extends DataCache {

	constructor(playerCount: number, tickCount: number) {
		super(playerCount, tickCount, 1, 16);
	}

	getHealth(playerId: number, tick: number): number {
		const offset = this.getOffset(playerId, tick);
		return this.data[offset];
	}

	setHealth(playerId: number, tick: number, health: number) {
		const offset = this.getOffset(playerId, tick);
		this.data[offset] = health;
	}
}
