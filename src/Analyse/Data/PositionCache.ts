import {DataCache} from "./DataCache";

export interface Point {
	x: number;
	y: number;
}

export interface MapBoundary {
	boundaryMin: Point;
	boundaryMax: Point;
}

export class PositionCache extends DataCache {
	offset: Point;

	constructor(playerCount: number, tickCount: number, offset: Point) {
		super(playerCount, tickCount, 2, 32);
		this.offset = offset;
	}

	getPosition(playerId: number, tick: number): Point {
		const offset = this.getOffset(playerId, tick);
		return {
			x: this.data[offset],
			y: this.data[offset + 1]
		}
	}

	setPostion(playerId: number, tick: number, position: Point) {
		const offset = this.getOffset(playerId, tick);
		this.data[offset] = position.x - this.offset.x;
		this.data[offset + 1] = position.y - this.offset.y;
	}
}
