import {DataCache} from "./DataCache";

export interface PlayerMeta {
	classId: number;
	teamId: number;
}

export class PlayerMetaCache extends DataCache {

	constructor(playerCount: number, tickCount: number) {
		super(playerCount, tickCount, 1, 8);
	}

	getMeta(playerId: number, tick: number): PlayerMeta {
		const offset = this.getOffset(playerId, tick);
		const data = this.data[offset];
		return {
			classId: data & 0x0F,
			teamId: (data & 0xF0) >> 4
		};
	}

	setMeta(playerId: number, tick: number, meta: PlayerMeta) {
		const offset = this.getOffset(playerId, tick);
		this.data[offset] = meta.classId | (meta.teamId << 4);
	}
}
