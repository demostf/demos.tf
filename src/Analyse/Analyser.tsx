import * as React from 'react';
import {MapRender} from './MapRender';
import {Demo, Header} from 'tf2-demo/build/es6';
import {MapContainer} from "./MapContainer";
import {Parser} from "./Data/Parser";
import {throttle} from 'lodash';
import {Timeline} from './Render/Timeline';
import {SpecHUD} from './Render/SpecHUD';
import {debounce} from 'lodash';
import {AnalyseMenu} from './AnalyseMenu'

import './Analyser.css'

export interface AnalyseProps {
	demo: Demo;
	header: Header;
	isStored: boolean;
}

export interface AnalyseState {
	worldSize: {
		width: number;
		height: number;
	}
	tick: number;
	playing: boolean;
	scale: number;
	error?: string;
	isShared: boolean;
}

interface JoinPacket {
	type: 'join';
	session: string;
}

interface CreatePacket {
	type: 'create';
	session: string;
}

interface TickPacket {
	type: 'tick';
	session: string;
	tick: number;
}

interface PlayPacket {
	type: 'play';
	session: string;
	play: boolean;
}

type Packet = JoinPacket | CreatePacket | TickPacket | PlayPacket;

function generateSession() {
	let string = "";
	const alphabet = "abcdefghijklmnopqrstuvwxyz";

	while (string.length < 6) {
		string += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return string;
}

const syncUri = 'wss://demos.tf/sync';

export class Analyser extends React.Component<AnalyseProps, {}> {
	parser: Parser;
	session?: WebSocket;
	isSessionOwner = false;
	sessionName: string;

	state: AnalyseState = {
		worldSize: {
			width: 0,
			height: 0
		},
		tick: 0,
		playing: false,
		scale: 1,
		isShared: false
	};

	constructor(props: AnalyseProps) {
		super(props);
		try {
			this.parser = new Parser(props.demo, props.header);
			this.parser.cacheData();
			this.sessionName = generateSession();
			if (props.isStored && window.location.hash) {
				const parsed = parseInt(window.location.hash.substr(1), 10);
				if (('#' + parsed) === window.location.hash) {
					this.state.tick = parsed;
				} else {
					this.joinSession(window.location.hash.substr(1));
				}
			}
		} catch (e) {
			this.state.error = e.message;
		}
	}

	componentDidMount() {
		const world = this.props.demo.getParser().match.world;
		const worldSize = {
			width: world.boundaryMax.x - world.boundaryMin.x,
			height: world.boundaryMax.y - world.boundaryMin.y,
		};
		this.setState({worldSize});
	}

	setTick = throttle((tick) => {
		this.setState({tick});
		this.setHash(tick);
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'tick',
				session: this.sessionName,
				tick: tick
			}));
		}
	}, 50);

	onTickInput = (event) => {
		this.setTick(parseInt(event.target.value, 10));
	};

	pause() {
		this.setState({playing: false});
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'play',
				session: this.sessionName,
				play: false
			}));
		}
	}

	play() {
		this.setState({playing: true});
		requestAnimationFrame(this.animFrame);
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'play',
				session: this.sessionName,
				play: true
			}));
		}
	}

	createSession = () => {
		if (this.session) {
			return;
		}
		this.isSessionOwner = true;
		this.setState({isShared: true});
		this.session = new WebSocket(syncUri, 'demo-sync');
		this.session.onopen = () => {
			this.session && this.session.send(JSON.stringify({
				type: 'create',
				session: this.sessionName
			}));
		}
	};

	joinSession(name: string) {
		if (this.session) {
			return;
		}
		this.sessionName = name;
		this.session = new WebSocket(syncUri, 'demo-sync');
		this.session.onopen = () => {
			if (this.session) {
				console.log('joining');
				this.session.send(JSON.stringify({
					type: 'join',
					session: name
				}));
				this.session.onmessage = (event) => {
					console.log(event.data);
					const packet = JSON.parse(event.data) as Packet;
					if (packet.type === 'tick') {
						this.setTick(packet.tick);
					}
					if (packet.type === 'play') {
						if (packet.play) {
							this.play();
						} else {
							this.pause();
						}
					}
				}
			}
		}
	}

	togglePlay = () => {
		if (this.state.playing) {
			this.pause();
		} else {
			this.play();
		}
	};

	setHash = debounce((tick) => {
		if (!this.session) {
			history.replaceState('', '', '#' + tick);
		}
	}, 250);

	animFrame = () => {
		if (this.state.tick === (this.parser.ticks - 1)) {
			this.pause();
		}
		this.setHash(this.state.tick);
		this.setState({tick: this.state.tick + 1});

		if (this.state.playing) {
			requestAnimationFrame(this.animFrame);
		}
	};

	render() {
		if (this.state.error) {
			return <div className="error-holder">
				<div className="error-image">Something broke...</div>
				<div className="error">
					{this.state.error}
					<div className="error-hint">
						You can report issues on <a
						href="https://github.com/demostf/demos.tf/issues">github</a>.
					</div>
				</div>
			</div>;
		}

		const {header} = this.props;
		const players = this.parser.getPlayersAtTick(this.state.tick);
		const playButtonText = (this.state.playing) ? '⏸' : '▶️';
		const disabled = (this.session && !this.isSessionOwner);

		return (
			<div>
				<h1>{header.server}</h1>
				<div className="map-holder">
					<MapContainer contentSize={this.state.worldSize}
					              onScale={scale => this.setState({scale})}>
						<MapRender size={this.state.worldSize} players={players}
						           header={this.props.header}
						           world={this.props.demo.getParser().match.world}
						           scale={this.state.scale}/>
					</MapContainer>
					<AnalyseMenu sessionName={this.sessionName}
					             onShare={this.createSession}
					             canShare={this.props.isStored && !disabled}
					             isShared={this.state.isShared}
					/>
					<SpecHUD parser={this.parser} tick={this.state.tick}
					         players={players}/>
					<input className="play-pause-button" type="button"
					       onClick={this.togglePlay}
					       value={playButtonText}
					       disabled={disabled}/>
					<Timeline parser={this.parser} tick={this.state.tick}
					          onSetTick={this.setTick}
					          disabled={disabled}/>
				</div>
			</div>
		);
	}
}
