import {BaseProvider} from './BaseProvider.js';
const request = require('superagent-promise')(require('superagent'), Promise);

export class DemoListProvider extends BaseProvider {
	more = true;
	cachedDemos = [];
	lastPage = 0;
	_endPoint = 'demos';
	cachedMaps = [];
	filter = {
		map: '',
		type: '',
		'players[]': []
	};

	get endPoint () {
		return this._endPoint;
	}

	set endPoint (endPoint) {
		if (endPoint !== this._endPoint) {
			this._endPoint = endPoint;
			this.reset();
		}
	}

	reset () {
		this.cachedDemos = [];
		this.lastPage = 0;
		this.more = true;
	}

	setFilter (type, value) {
		if (this.filter[type] !== value) {
			this.filter = {
				... this.filter
			};
			this.filter[type] = value;
			this.reset();
		}
	}

	constructor () {
		super();
	}

	loadNextPage () {
		return this.loadTillPage(this.lastPage + 1);
	}

	async getDemos (page = 1) {
		var params = this.filter;
		
		params.page = page;
		var response = await this.request(this.endPoint, params);
		var demos = response.body.map(this.formatResponse);
		if (demos.length < 1) {
			this.more = false;
		}
		this.cachedDemos = this.cachedDemos.concat(demos);
	}

	async loadTillPage (page) {
		if (page > this.lastPage && this.more) {
			for (var i = this.lastPage + 1; i <= page; i++) {
				await this.getDemos(i);
			}
			this.lastPage = i - 1;
		}
		return this.demos;
	}

	async listMaps () {
		if (this.cachedMaps.length > 0) {
			return this.cachedMaps;
		}
		var response = await this.request('maps');
		return this.cachedMaps = this.formatResponse(response.body);
	}

	get demos () {
		return this.cachedDemos;
	}

	async getStats () {
		var response = await this.request('stats');
		return response.body;
	}
}

export class DemoProvider extends BaseProvider {
	cached = [];

	async getDemo (id) {
		if (this.cached[id]) {
			return this.cached[id];
		}
		var response = await this.request('demos/' + id);
		this.cached[id] = this.formatResponse(response.body);
		return this.cached[id];
	}

	async getChat (id) {
		var response = await this.request('demos/' + id + '/chat');
		return this.formatResponse(response.body);
	}

	async uploadDemo (key, red, blu, name, demo) {
		var response = await request.post(this.getApiUrl('upload'))
		//.type('form')
			.field('key', key)
			.field('red', red)
			.field('blu', blu)
			.field('name', name)
			.attach("demo", demo, demo.name)
			.end();
		var body = response.text;
		var expected = 'STV available at: http://upload.local.demos.tf/';
		if (body.substr(0, expected.length) === expected) {
			return body.substr(expected.length);
		}
	}
}
