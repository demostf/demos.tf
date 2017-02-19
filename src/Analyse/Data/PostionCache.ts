export interface Point {
	x: number;
	y: number;
}

export interface MapBoundary {
	boundaryMin: Point;
	boundaryMax: Point;
}

export class PostionCache {
	data: Uint32Array;
	playerCount: number;
	tickCount: number;
	offset: Point;

	constructor(playerCount: number, tickCount: number, offset: Point) {
		this.playerCount = playerCount;
		this.tickCount = tickCount;
		this.data = new Uint32Array(this.length);
		this.offset = offset;
	}

	private getOffset(playerId: number, tick: number) {
		const playerOffset = playerId * this.tickCount * 2;
		return playerOffset + (tick * 2);
	}

	getPostion(playerId: number, tick: number): Point {
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

	get length() {
		return 2 * this.playerCount * this.tickCount;
	}
}
