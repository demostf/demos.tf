import {BaseProvider} from './BaseProvider.js';

export class PlayerProvider extends BaseProvider {
	static nameMap = {};


	async search (query) {
		if (query.length <= 2) {
			return [];
		}
		const users = await this.request('users/search', {query});

		for (let user of users) {
			PlayerProvider.nameMap[user.steamid] = user.name;
		}
		return users;
	}

	async getName (steamid) {
		if (!PlayerProvider.nameMap[steamid]) {
			const user = await this.request('users/' + steamid);
			PlayerProvider.nameMap[steamid] = user.name;
		}
		return PlayerProvider.nameMap[steamid];
	}
}
