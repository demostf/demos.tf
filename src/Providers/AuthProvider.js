import {BaseProvider} from './BaseProvider.js';

export class AuthProvider extends BaseProvider {
	token = null;
	user = null;

	constructor() {
		super();
	}

	async login() {
		const token = await this.getToken();
		window.location.replace(this.getApiUrl('auth/login/' + token + '/?return=' + window.location));
	}

	async logout() {
		const token = await this.getToken();
		this.user = await this.request('auth/logout/' + token);
	}

	async loadAuth() {
		const token = await this.getToken();
		this.user = await this.request('auth/get/' + token);
		this.token = this.user.token;
	}

	newToken() {
		return this.request('auth/token', {}, false);
	}

	async getUser() {
		if (!this.user) {
			await this.loadAuth();
		}
		return this.user;
	}

	async getToken() {
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
