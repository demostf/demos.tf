import {BaseProvider} from './BaseProvider';
import {SteamId, SteamUser} from "./DemoProvider";

export class PlayerProvider extends BaseProvider {
	static nameMap = {};
	static userMap = new Map<SteamId, SteamUser>();

	async search(query: string): Promise<SteamUser[]> {
		if (query.length <= 2) {
			return [];
		}
		const users = await this.request('users/search', {query}) as SteamUser[];

		for (let user of users) {
			PlayerProvider.userMap.set(user.steamid, user);
			PlayerProvider.nameMap[user.steamid] = user.name;
		}
		return users;
	}

	getName(steamid: SteamId): Promise<string> {
		return this.getUser(steamid).then(user => user.name);
	}

	async getUser(steamid: SteamId): Promise<SteamUser> {
		const cachedUser = PlayerProvider.userMap.get(steamid);
		if (cachedUser) {
			return cachedUser;
		} else {
			const user = await this.request('users/' + steamid) as SteamUser;
			PlayerProvider.userMap.set(user.steamid, user);
			return user;
		}
	}
}
