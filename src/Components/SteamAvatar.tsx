import * as React from 'react';
import {BaseProvider} from "../Providers/BaseProvider";

export interface SteamAvatarProps {
	steamId: string;
}

export interface SteamAvatarState {
	url: string;
}

export class SteamAvatar extends React.Component<SteamAvatarProps, SteamAvatarState> {
	static avatarCache: Map<string, string> = new Map();

	state: SteamAvatarState = {
		url: ''
	};

	getAvatarUrl(steamId: string): Promise<string> {
		if (SteamAvatar.avatarCache.has(steamId)) {
			return Promise.resolve(SteamAvatar.avatarCache.get(steamId) as string);
		}

		const url = `${BaseProvider.getBaseUrl()}users/${steamId}`;
		return fetch(url)
			.then((response) => {
				return response.json();
			}).then((data: { avatar: string }) => {
				const avatar = data.avatar;
				SteamAvatar.avatarCache.set(steamId, avatar);
				console.log(avatar);
				return avatar;
			});
	}

	render() {
		if (this.state.url === '') {
			this.getAvatarUrl(this.props.steamId)
				.then(url => this.setState({url}));
		}

		return <img src={this.state.url} className='steam-avatar'/>
	}
}
