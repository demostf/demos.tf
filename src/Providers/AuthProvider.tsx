import {BaseProvider} from './BaseProvider';

export interface User {
	token: string;
	key: string|null;
	name: string|null;
	steamid: string|null;
}

export class AuthProvider extends BaseProvider {
	static instance = new AuthProvider();

	token: string|null;
	user: User|null;

	async login() {
		const token = await this.getToken();
		window.location.replace(this.getApiUrl('auth/login/' + token + '/?return=' + window.location));
	}

	async logout() {
		const token = await this.getToken();
		if (token === "bot") {
			this.user = {
				token,
				steamid: null,
				name: null,
				key: null,
			}
		} else {
			this.user = await this.request('auth/logout/' + token);
		}
	}

	async loadAuth() {
		const token = await this.getToken();
		this.user = (await this.request('auth/get/' + token)) as User;
		this.token = this.user.token;
	}

	async newToken(): Promise<string> {
		if (navigator.userAgent.search("YandexBot") !== -1 || navigator.userAgent.search("PetalBot") !== -1) {
			return "bot";
		}
		return await this.request('auth/token', {}, false);
	}

	async getUser(): Promise<User> {
		if (!this.user) {
			await this.loadAuth();
		}
		return this.user as User;
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
