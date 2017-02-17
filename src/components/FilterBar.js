import React, {Component} from 'react';
import Select from 'react-select';
import {PlayerProvider} from '../Providers/PlayerProvider.js'

require('./FilterBar.css');
require('react-select/dist/react-select.css');

export class FilterBar extends Component {
	selectedUsers = [];

	state = {
		type   : '',
		map    : '',
		players: ''
	};

	constructor() {
		super();
		this.playerProvider = new PlayerProvider();
	}

	getMaps = async() => {
		const maps = await this.props.provider.listMaps();
		return {
			options : maps.map(map => {
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
					options : users.concat(selectedUsers),
					complete: false
				};
			});
	};

	onInputChange = (type, value) => {
		console.log(type, value);
		const newState = {};
		newState[type] = value;
		this.setState(newState);
	};

	render() {
		const typeOptions = [
			{value: '4v4', label: '4v4'},
			{value: '6v6', label: '6v6'},
			{value: 'hl', label: 'Highlander'}
		];

		const nameOptions = [];
		for (const steamid in PlayerProvider.nameMap) {
			if (PlayerProvider.nameMap.hasOwnProperty(steamid)) {
				nameOptions.push({
					value: steamid,
					label: PlayerProvider.nameMap[steamid]
				})
			}
		}

		console.log(this.props.filter['players[]']);
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
				<Select.Async
					className="map"
					value={this.props.filter.map}
					placeholder="All Maps"
					loadOptions={this.getMaps}
					onChange={value => this.setFilter('map', value)}
					searchable={true}
				/>
				<Select.Async
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
