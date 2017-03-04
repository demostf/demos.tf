import {DataCache} from "./DataCache";

export class HealthCache extends DataCache {
	constructor(tickCount: number) {
		super(tickCount, 1, 16);
	}
}
