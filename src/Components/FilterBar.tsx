import * as React from 'react';
import Select, {Options} from 'react-select';
import Async from 'react-select/async';
import {PlayerProvider} from '../Providers/PlayerProvider'

import './FilterBar.css';
import {DemoListProvider, DemoListFilter, SteamUser} from "../Providers/DemoProvider";
import {config} from '../config';
import {StringSelect} from "./StringSelect";

export interface OptionType {
	value: string,
	label: string
}

const typeOptions: Options<OptionType> = Object.keys(config.gameTypes).map(key => {
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
	maps: string[];
	selectedUsers: SteamUser[];
	map: string;
	type: null | OptionType;
}

export class FilterBar extends React.Component<FilterBarProps, FilterBarState> {
	playerProvider: PlayerProvider;

	state: FilterBarState = {
		maps: [],
		selectedUsers: [],
		map: '',
		type: null
	};

	constructor(props) {
		super(props);
		this.playerProvider = new PlayerProvider();
	}

	componentDidMount() {
		this.props.provider.listMaps().then(maps => this.setState({maps}));
		this.setStateFromFilter();
	}

	async setStateFromFilter() {
		const selectedUsers = await Promise.all(this.props.filter['players[]'].map(steamId => this.playerProvider.getUser(steamId)));

		this.setState({
			map: this.props.provider.filter.map ? this.props.provider.filter.map : '',
			type: this.props.provider.filter.type ? {
				value: this.props.provider.filter.type,
				label: config.gameTypes[this.props.provider.filter.type]
			} : null,
			selectedUsers
		});
	}

	setType = (value: OptionType | null) => {
		const type = value ? value.value : null;
		this.props.provider.setFilter('type', type);
		if (this.props.onChange) {
			this.props.onChange();
		}
		this.setState({type: value});
	};

	setMap = (map) => {
		this.props.provider.setFilter('map', map);
		if (this.props.onChange) {
			this.props.onChange();
		}
		this.setState({map});
	};

	setPlayers = (selectedUsers: SteamUser[]) => {
		this.props.provider.setFilter('players[]', selectedUsers.map(user => user.steamid));
		if (this.props.onChange) {
			this.props.onChange();
		}
		this.setState({selectedUsers});
	};

	searchUsers = async (query): Promise<SteamUser[]> => {
		const selectedUsers = await Promise.all(this.props.filter['players[]'].map(steamId => this.playerProvider.getUser(steamId)));
		const foundUsers = await this.playerProvider.search(query);
		return foundUsers.concat(selectedUsers);
	};

	render() {
		return (
			<div className="filterbar">
				<Select
					className="type"
					placeholder="All Types"
					options={typeOptions}
					onChange={(value: OptionType | null) => this.setType(value)}
					isClearable={true}
					value={this.state.type}
					styles={{
						control: (base) => ({
							...base,
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
							borderRightWidth: 0,
						}),
						option: (styles, { isFocused, isSelected }) => ({
							...styles,
							backgroundColor: isSelected ? 'var(--highlight-primary)' : isFocused ? 'var(--highlight-secondary)' : undefined
						}),
						input: (base) => ({
							...base,
							color: 'var(--text-primary)'
						})
					}}
				/>
				<StringSelect
					className="map"
					placeholder="All Maps"
					options={this.state.maps}
					onChange={value => this.setMap(value)}
					isClearable={true}
					value={this.state.map}
					styles={{
						control: (base) => ({
							...base,
							borderRadius: 0
						}),
						option: (styles, { isFocused, isSelected }) => ({
							...styles,
							backgroundColor: isSelected ? 'var(--highlight-primary)' : isFocused ? 'var(--highlight-secondary)' : undefined
						}),
						input: (base) => ({
							...base,
							color: 'var(--text-primary)'
						})
					}}
				/>
				<Async
					className="players"
					isMulti={true}
					defaultOptions={this.state.selectedUsers}
					placeholder="All Players"
					loadOptions={this.searchUsers}
					onChange={this.setPlayers}
					isClearable={true}
					getOptionLabel={(user: SteamUser) => user.name}
					getOptionValue={(user: SteamUser) => user.steamid}
					cacheOptions={false}
					value={this.state.selectedUsers}
					styles={{
						control: (base) => ({
							...base,
							borderTopLeftRadius: 0,
							borderBottomLeftRadius: 0,
							borderLeftWidth: 0
						}),
						option: (styles, { isFocused, isSelected }) => ({
							...styles,
							backgroundColor: isSelected ? 'var(--highlight-primary)' : isFocused ? 'var(--highlight-secondary)' : undefined
						}),
						input: (base) => ({
							...base,
							color: 'var(--text-primary)'
						})
					}}
				/>
			</div>
		);
	}

}
