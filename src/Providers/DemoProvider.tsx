import {BaseProvider} from './BaseProvider';

export interface DemoInfo {
	id: number;
	blue: string;
	blueScore: number;
	red: string;
	redScore: number;
	duration: number;
	map: string;
	name: string;
	nick: string;
	playerCount: number;
	server: string;
	time: number;
	uploader: number;
	url: string;
}

export interface Stats {
	demos: number;
	players: number;
	// uploader: number;
}

export interface DemoListFilter {
	map: string;
	type: string;
	'players[]': string[];
	page: number;
}

export class DemoListProvider extends BaseProvider {
	static instance = new DemoListProvider();

	more = true;
	cachedDemos: DemoInfo[] = [];
	lastPage = 0;
	_endPoint = 'demos';
	cachedMaps: Promise<string[]>|null = null;
	filter: DemoListFilter = {
		map: '',
		type: '',
		'players[]': [],
		page: 0
	};

	get endPoint() {
		return this._endPoint;
	}

	set endPoint(endPoint) {
		if (endPoint !== this._endPoint) {
			this._endPoint = endPoint;
			this.reset();
		}
	}

	reset() {
		this.cachedDemos = [];
		this.lastPage = 0;
		this.more = true;
	}

	setFilter(type, value) {
		if (this.filter[type] !== value) {
			this.filter = {
				...this.filter
			};
			this.filter[type] = value;
			this.reset();
		}
	}

	constructor() {
		super();
	}

	loadNextPage() {
		return this.loadTillPage(this.lastPage + 1);
	}

	async getDemos(page = 1) {
		const params = this.filter;

		params.page = page;
		const demos = (await this.request(this.endPoint, params)).map(this.formatResponse);
		if (demos.length < 1) {
			this.more = false;
		}
		this.cachedDemos = this.cachedDemos.concat(demos);
	}

	async loadTillPage(page) {
		if (page > this.lastPage && this.more) {
			let i;
			for (i = this.lastPage + 1; i <= page; i++) {
				await this.getDemos(i);
			}
			this.lastPage = i - 1;
		}
		return this.demos;
	}

	listMaps(): Promise<string[]> {
		if (!this.cachedMaps) {
			this.cachedMaps = this.request('maps') as Promise<string[]>;
		}
		return this.cachedMaps;
	}

	get demos(): DemoInfo[] {
		return this.cachedDemos;
	}

	getStats(): Promise<Stats> {
		return this.request('stats');
	}
}

export interface ChatMessage {
	message: string;
	time: number;
	user: string;
}

export type SteamId = string;

export interface SteamUser {
	id: number;
	steamid: SteamId;
	name: string;
}

export interface Player extends SteamUser {
	kills: number;
	assists: number;
	deaths: number;
	user_id: number;
	avatar: string;
	'class': string;
	team: string;
}

export interface Demo {
	id: number;
	blue: string;
	blueScore: number;
	red: string;
	redScore: number;
	duration: number;
	map: string;
	name: string;
	nick: string;
	playerCount: number;
	server: string;
	time: Date;
	uploader: SteamUser;
	url: string;
	players: Player[];
}

export class DemoProvider extends BaseProvider {
	static instance = new DemoProvider();

	cached: Map<number, Demo> = new Map();

	async getDemo(id: number): Promise<Demo> {
		const cached = this.cached.get(id);
		if (cached) {
			return cached;
		}
		const response = await this.request('demos/' + id);
		const result = this.formatResponse(response);
		this.cached.set(id, result);
		return result;
	}

	getChat(id): Promise<ChatMessage[]> {
		return this.request('demos/' + id + '/chat');
	}

	async uploadDemo(key: string, red: string, blu: string, name: string, demo: File): Promise<string> {
		const data = new FormData();
		data.append('key', key);
		data.append('red', red);
		data.append('blu', blu);
		data.append('name', name);
		data.append('demo', demo, demo.name);
		const response = await fetch(this.getApiUrl('upload'), {
			method: 'POST',
			body: data
		});
		if (response.status >= 400) {
			throw new Error(await response.text());
		}
		const body = await response.text();
		const matches = body.match(/STV available at: https?:\/\/[^/]+\/(\d+)/);
		if (matches) {
			return matches[1];
		} else {
			return '';
		}
	}
}
