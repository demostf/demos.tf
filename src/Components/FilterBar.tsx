import * as React from 'react';
import Select, {Async, Option} from 'react-select';
import {PlayerProvider} from '../Providers/PlayerProvider'

import './FilterBar.css';
import 'react-select/dist/react-select.css';
import {DemoListProvider, DemoListFilter} from "../Providers/DemoProvider";
import {config} from '../config';

const typeOptions: Option[] = Object.keys(config.gameTypes).map(key => {
	return {
		value: key,
		label: config.gameTypes[key]
	}
});

export interface FilterBarProps {
	provider: DemoListProvider;
	onChange: Function;
	filter: DemoListFilter;
}

export interface FilterBarState {
	type: string;
	mpa: string;
	players: string;
}

export class FilterBar extends React.Component<FilterBarProps, FilterBarState> {
	selectedUsers = [];
	playerProvider: PlayerProvider;

	constructor(props) {
		super(props);
		this.playerProvider = new PlayerProvider();
	}

	getMaps = async () => {
		const maps = await this.props.provider.listMaps();
		return {
			options: maps.map(map => {
				return {value: map, label: map};
			}),
			complete: true
		};
	};

	setFilter = (type, value) => {
		if (type === 'players[]') {
			this.selectedUsers = value;
		}
		if (value && value.value) {
			value = value.value;
		}
		if (value && value.map) {
			value = value.map(player => player.value);
		}
		this.props.provider.setFilter(type, value);
		if (this.props.onChange) {
			this.props.onChange();
		}
	};

	searchUsers = (query) => {
		return this.playerProvider.search(query)
			.then(users => users.map(user => {
				return {
					value: user.steamid,
					label: user.name
				}
			}))
			.then(users => {
				const selectedUsers = this.props.filter['players[]'].map(steamId => {
					return {
						value: steamId,
						label: PlayerProvider.nameMap[steamId]
					};
				});
				return {
					options: users.concat(selectedUsers),
					complete: false
				};
			});
	};

	onInputChange = (type, value) => {
		const newState = {};
		newState[type] = value;
		this.setState(newState);
	};

	render() {
		return (
			<div className="filterbar">
				<Select
					className="type"
					value={this.props.filter.type}
					placeholder="All Types"
					options={typeOptions}
					onInputChange={value => this.onInputChange('type', value)}
					onChange={value => this.setFilter('type', value)}
					searchable={true}
				/>
				<Async
					className="map"
					value={this.props.filter.map}
					placeholder="All Maps"
					loadOptions={this.getMaps}
					onChange={value => this.setFilter('map', value)}
					searchable={true}
				/>
				<Async
					className="players"
					multi={true}
					value={this.selectedUsers}
					placeholder="All Players"
					loadOptions={this.searchUsers}
					onChange={value => this.setFilter('players[]', value)}
					minimumInput={2}
					cache={false}
					searchable={true}
				/>
			</div>
		);
	}

}
