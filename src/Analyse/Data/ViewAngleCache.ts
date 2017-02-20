import {DataCache} from "./DataCache";

export class ViewAngleCache extends DataCache {

	constructor(playerCount: number, tickCount: number) {
		super(playerCount, tickCount, 1, 16);
	}

	getAngle(playerId: number, tick: number): number {
		const offset = this.getOffset(playerId, tick);
		return this.data[offset];
	}

	setAngle(playerId: number, tick: number, angle: number) {
		const offset = this.getOffset(playerId, tick);
		this.data[offset] = angle;
	}
}
