'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import {fuzzyTime} from '../FuzzyTime';
import {Duration} from '../components/Duration.js'
import {PlayerTable} from '../components/PlayerTable.js'
import {TeamBanner} from '../components/TeamBanner.js'
import {ChatTable} from '../components/ChatTable.js'
import {DemoProvider} from '../Providers/DemoProvider.js';
import {Footer} from '../components/Footer.js';
import Spinner from 'react-spinner';

require('./DemoPage.css');

export class DemoPage extends Component {
	static page = 'demo';

	state = {
		demo    : {
			id         : 0,
			name       : '',
			red        : '',
			blue       : '',
			server     : '',
			playerCount: 0,
			players    : [],
			duration   : 0,
			map        : '',
			time       : new Date(0),
			uploader   : {
				id     : 0,
				steamid: '',
				name   : ''
			}
		},
		chat    : [],
		showChat: false
	};

	constructor(props) {
		super(props);
		this.loadedChat = false;
		this.provider = props.demoProvider;
	}

	componentDidMount = async() => {
		document.title = 'Loading - demos.tf';
		const demo = await this.provider.getDemo(this.props.params.id);
		document.title = demo.server + ' - demos.tf';
		this.setState({demo});
	};

	toggleChat = () => {
		this.setState({
			showChat: !this.state.showChat
		});
		if (!this.loadedChat) {
			this.loadChat();
		}
	};

	async loadChat() {
		if (this.loadedChat) {
			return;
		}
		this.loadedChat = true;
		const chat = await this.provider.getChat(this.props.params.id);
		this.setState({chat});
	}

	render() {
		let chatTable;
		if (this.state.showChat) {
			console.log(this.state);
			chatTable = (
				<ChatTable messages={this.state.chat} />
			);
		} else {
			chatTable = [];
		}
		const demo = this.state.demo;
		if (this.state.demo.id !== 0) {
			return (
				<div>
					<h2>{demo.server} - {demo.red}
						&nbsp;vs&nbsp;{demo.blue}</h2>

					<h3>{demo.name}</h3>

					<p>Demo uploaded
						by <Link
							to={'/uploads/' + demo.uploader.steamid}>{demo.uploader.name}
						</Link> {fuzzyTime(demo.time)}
					</p>
					<TeamBanner redScore={demo.redScore}
								blueScore={demo.blueScore}
								redName={demo.red} blueName={demo.blue}
								red={demo.redTeam} blue={demo.blueTeam} />
					<PlayerTable players={demo.players} />

					<p className="demo-info">
						<span>{demo.map}</span>
						<Duration className="time"
								  duration={demo.duration} />
					</p>

					{chatTable}

					<p className="demo-download">
						<a className=" pure-button pure-button-primary"
						   href={demo.url} download={demo.name}>Download</a>
						<button className=" pure-button"
								onClick={this.toggleChat}>{this.state.showChat ? 'Hide Chat' : 'Show Chat'}
						</button>
					</p>
					<Footer />
				</div>
			);
		} else {
			return <Spinner />
		}
	}
}
