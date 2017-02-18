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
	more = true;
	cachedDemos: DemoInfo[] = [];
	lastPage = 0;
	_endPoint = 'demos';
	cachedMaps: string[] = [];
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
				... this.filter
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

	async listMaps(): Promise<string[]> {
		if (this.cachedMaps.length > 0) {
			return this.cachedMaps;
		}
		return this.cachedMaps = await this.request('maps');
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

export interface SteamUser {
	id: number;
	steamid: string;
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
	cached: Demo[] = [];

	async getDemo(id): Promise<Demo> {
		if (this.cached[id]) {
			return this.cached[id];
		}
		const response = await this.request('demos/' + id);
		this.cached[id] = this.formatResponse(response);
		return this.cached[id];
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
		const body = await response.text();
		const expected = 'STV available at: http://demos.tf/';
		if (body.substr(0, expected.length) === expected) {
			return body.substr(expected.length);
		} else {
			return '';
		}
	}
}
