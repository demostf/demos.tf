import {BaseProvider} from './BaseProvider.js';

export class AuthProvider extends BaseProvider {
	token = null;
	user = null;

	constructor () {
		super();
	}

	async login () {
		var token = await this.getToken();
		window.location.replace(this.getApiUrl('auth/login/' + token + '/?return=' + window.location));
	}

	async logout () {
		var token = await this.getToken();
		var response = await this.request('auth/logout/' + token);
		this.user = response.body;
	}

	async loadAuth () {
		var token = await this.getToken();
		var response = await this.request('auth/get/' + token);
		this.user = response.body;
		this.token = this.user.token;
	}

	async newToken () {
		var response = await this.request('auth/token');
		return response.text;
	}

	async getUser () {
		if (!this.user) {
			await this.loadAuth();
		}
		return this.user;
	}

	async getToken () {
		if (!this.token) {
			this.token = localStorage.getItem('token');
			if (!this.token || this.token.length < 16) {
				this.token = await this.newToken();
				localStorage.setItem('token', this.token);
			}
		}
		return this.token;
	}
}
