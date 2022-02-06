import * as React from 'react';

import ReactList from 'react-list';

import {DemoListProvider} from '../Providers/DemoProvider';
import {DemoRow} from '../Components/DemoRow';
import {Footer} from '../Components/Footer';
import {FilterBar} from '../Components/FilterBar';
import {PlayerProvider} from '../Providers/PlayerProvider';
import Spinner from 'react-spinner';
import {config} from '../config';

import './ListPage.css';
import 'react-spinner/react-spinner.css';
import {DemoInfo} from "../Providers/DemoProvider";
import Element = JSX.Element;
import {StringSelect} from "../Components/StringSelect";
import {NavigateFunction} from "react-router";
import {Location} from "history";

export interface ListPageState {
	demos: DemoInfo[];
	steamid: string;
	isUploads: boolean;
	loading: boolean;
	subjectName: string;
	highlightUsers: string[];
}

export interface ListPageProps {
	demoListProvider: DemoListProvider;
	match: {
		steamid?: string
	},
	navigate: NavigateFunction,
	location: Location
}

export class ListPage extends React.Component<ListPageProps, ListPageState> {
	static page = 'list';

	endpoint: string;
	playerProvider = new PlayerProvider();
	provider = DemoListProvider.instance;

	state: ListPageState = {
		demos: [],
		steamid: '',
		isUploads: false,
		loading: true,
		subjectName: '',
		highlightUsers: []
	};

	loading = false;

	rowMap: { [key: string]: Element } = {};

	constructor(props: ListPageProps) {
		super(props);

		this.state.highlightUsers = this.provider.filter["players[]"];
		if (this.props.match.steamid) {
			this.state.steamid = this.props.match.steamid;
			this.state.isUploads = this.props.location.pathname.substring(0, 9) === '/uploads/';
			if (this.state.isUploads) {
				this.endpoint = 'uploads/' + this.props.match.steamid;
			} else {
				this.endpoint = 'profiles/' + this.props.match.steamid;
				if (!this.state.highlightUsers.includes(this.props.match.steamid)) {
					this.state.highlightUsers.push(this.props.match.steamid);
				}
			}
		} else {
			this.state.isUploads = false;
			this.endpoint = 'demos';
		}
		this.provider.endPoint = this.endpoint;
	}

	componentWillReceiveProps(props) {
		const params = props.match.params || {};
		let isUploads = false, steamid = '';
		this.playerProvider = new PlayerProvider();
		if (params.steamid) {
			steamid = params.steamid;
			isUploads = props.location.pathname.substring(0, 9) === '/uploads/';
			if (isUploads) {
				this.endpoint = 'uploads/' + params.steamid;
			} else {
				this.endpoint = 'profiles/' + params.steamid;
			}
		} else {
			this.endpoint = 'demos';
		}
		this.provider.endPoint = this.endpoint;
		this.filterChange();
		this.setState({steamid, isUploads, highlightUsers: this.provider.filter["players[]"]});
	}

	filterChange() {
		this.provider.reset();
		this.loading = false;
		this.setState({demos: [], highlightUsers: this.provider.filter["players[]"]});
		this.rowMap = {};
		this.loadPage();
	}

	async loadPage() {
		if (this.loading || !this.provider.more) {
			return;
		}
		this.loading = true;
		const demos = await this.provider.loadNextPage();
		if (this.state.demos.length === demos.length) {
			if (this.provider.more) {
				this.setState({demos: []});
				this.rowMap = {};
			} else {
				this.loading = false;
				return;
			}
		}
		this.setState({demos});
		this.loading = false;
		if (demos.length < 40 && this.provider.more) {
			setTimeout(this.loadPage.bind(this), 10);
		}
	}

	getSubjectName = async () => {
		if (this.state.steamid) {
			const subjectName = await this.playerProvider.getName(this.state.steamid);
			if (this.state.subjectName !== subjectName) {
				this.setState({subjectName});
			}
		} else if (this.state.subjectName !== '') {
			this.setState({subjectName: ''});
		}
	};

	componentDidMount() {
		document.title = 'Demos - demos.tf';
		this.provider.loadTillPage(1).then((demos) => {
			this.getSubjectName().then(() => {
				this.setState({loading: false, demos});
			});
		});
	};

	renderItem(i) {
		if (i > this.state.demos.length - 5 && this.provider.more) {
			this.loadPage();
		}
		const demo = this.state.demos[i];
		if (!demo) {
			return null;
		}
		if (this.rowMap[demo.id]) {
			return this.rowMap[demo.id];
		}
		this.rowMap[demo.id] = <DemoRow i={i} key={i} {...demo} highlightUsers={this.state.highlightUsers} />;
		return this.rowMap[demo.id];
	}

	renderItems(items, ref) {
		return (
			<table ref={ref} className="demolist">
				<thead className="head">
					<tr>
						<th className="title">Title</th>
						<th className="format">Format</th>
						<th className="map">Map</th>
						<th className="duration">Duration</th>
						<th className="date">Date</th>
					</tr>
				</thead>
				<tbody>
					{items}
				</tbody>
			</table>
		)
	}

	render() {
		this.getSubjectName();
		let demoTitle: Element | string = 'Demos';
		if (this.state.steamid) {
			const setListType = (type) => {
				const isUploads = type.toLowerCase() === 'uploads';
				console.log(isUploads);
				if (isUploads !== this.state.isUploads) {
					if (isUploads) {
						this.endpoint = 'uploads/' + this.state.steamid;
					} else {
						this.endpoint = 'profiles/' + this.state.steamid;
					}
					this.provider.endPoint = this.endpoint;
					this.filterChange();
					this.setState({isUploads, demos: []});
					this.props.navigate('/' + (isUploads ? 'uploads' : 'profiles') + '/' + this.state.steamid);
				}
			};
			demoTitle = (
				<span className="listType">
					{config.showUpload ?
						<StringSelect
							options={['Uploads', 'Demos']}
							isClearable={false}
							value={this.state.isUploads ? 'Uploads' : 'Demos'}
							onChange={setListType}
							isSearchable={false}

							styles={{
								control: (base) => ({
									...base,
									borderRadius: 0,
									border: 'none',
									height: 62,
									background: 'transparent',
									position: 'relative',
									top: 5
								}),
								container: (base) => ({
									...base,
									width: 230,
									display: 'inline-block',
									cursor: 'pointer',
									marginTop: 0
								})
							}}
						/> : (this.state.isUploads ? 'Uploads ' : 'Demos ')}{this.state.isUploads ? 'by' : 'for'} {this.state.subjectName}
				</span>
			);
		}

		return (
			<div>
				<h1>{demoTitle}</h1>
				<div className="search">
					<FilterBar provider={this.provider}
							   filter={this.provider.filter}
							   onChange={this.filterChange.bind(this)}/>
				</div>

				{!this.state.loading ?
					(<ReactList
						type="uniform"
						itemRenderer={this.renderItem.bind(this)}
						itemsRenderer={this.renderItems.bind(this)}
						length={this.state.demos.length}
					/>) : (<Spinner/>)}
				<Footer/>
			</div>
		);
	}
}
