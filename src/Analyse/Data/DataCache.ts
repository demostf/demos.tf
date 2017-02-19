export class DataCache {
	data: Uint32Array|Uint8Array|Uint16Array;
	playerCount: number;
	tickCount: number;
	valuesPerPlayer: number

	constructor(playerCount: number, tickCount: number, valuesPerPlayer: number, bitWidth: number) {
		this.playerCount = playerCount;
		this.tickCount = tickCount;
		this.valuesPerPlayer = valuesPerPlayer;
		switch (bitWidth) {
			case 8:
				this.data = new Uint16Array(this.length);
				break;
			case 16:
				this.data = new Uint16Array(this.length);
				break;
			case 32:
				this.data = new Uint32Array(this.length);
				break;
			default:
				throw new Error('invalid bit width for cache');
		}
	}

	protected getOffset(playerId: number, tick: number) {
		const playerOffset = playerId * this.tickCount * this.valuesPerPlayer;
		return playerOffset + (tick * this.valuesPerPlayer);
	}

	get length() {
		return this.valuesPerPlayer * this.playerCount * this.tickCount;
	}
}
