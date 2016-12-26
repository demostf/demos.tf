import {BaseProvider} from './BaseProvider.js';

export class DemoListProvider extends BaseProvider {
	more = true;
	cachedDemos = [];
	lastPage = 0;
	_endPoint = 'demos';
	cachedMaps = [];
	filter = {
		map        : '',
		type       : '',
		'players[]': []
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

	async listMaps() {
		if (this.cachedMaps.length > 0) {
			return this.cachedMaps;
		}
		return this.cachedMaps = await this.request('maps');
	}

	get demos() {
		return this.cachedDemos;
	}

	getStats() {
		return this.request('stats');
	}
}

export class DemoProvider extends BaseProvider {
	cached = [];

	async getDemo(id) {
		if (this.cached[id]) {
			return this.cached[id];
		}
		const response = await this.request('demos/' + id);
		this.cached[id] = this.formatResponse(response);
		return this.cached[id];
	}

	getChat(id) {
		return this.request('demos/' + id + '/chat');
	}

	async uploadDemo(key, red, blu, name, demo) {
		const data = new FormData();
		data.append('key', key);
		data.append('red', red);
		data.append('blu', blu);
		data.append('name', name);
		data.append('demo', demo, demo.name);
		const response = await fetch(this.getApiUrl('upload'), {
			method: 'POST',
			body  : data
		});
		const body = response.text;
		const expected = 'STV available at: http://upload.local.demos.tf/';
		if (body.substr(0, expected.length) === expected) {
			return body.substr(expected.length);
		}
	}
}
