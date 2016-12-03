import {BaseProvider} from './BaseProvider.js';

export class PlayerProvider extends BaseProvider {
	static nameMap = {};


	async search (query) {
		if (query.length <= 2) {
			return [];
		}
		const response = await this.request('users/search', {query});
		const users = response.body;

		for (var user of users) {
			PlayerProvider.nameMap[user.steamid] = user.name;
		}
		return users;
	}

	async getName (steamid) {
		if (!PlayerProvider.nameMap[steamid]) {
			var response = await this.request('users/' + steamid);
			var user = response.body;
			PlayerProvider.nameMap[steamid] = user.name;
		}
		return PlayerProvider.nameMap[steamid];
	}
}
