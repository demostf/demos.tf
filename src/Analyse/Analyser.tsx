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
import {AsyncParser} from "./Data/AsyncParser";

export interface AnalyseProps {
	header: Header;
	isStored: boolean;
	parser: AsyncParser;
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
	play?: boolean;
	tick?: boolean; //old sync server
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

const syncUri = 'wss://sync.demos.tf';

export class Analyser extends React.Component<AnalyseProps, {}> {
	parser: AsyncParser;
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

	intervalPerTick: number;
	lastFrameTime: number = 0;
	playStartTime: number;
	playStartTick: number;
	lastTickSend: number = 0;

	constructor(props: AnalyseProps) {
		super(props);
		this.parser = props.parser;
		this.intervalPerTick = this.parser.intervalPerTick;
		this.sessionName = generateSession();
		if (props.isStored && window.location.hash) {
			const parsed = parseInt(window.location.hash.substr(1), 10);
			if (('#' + parsed) === window.location.hash) {
				this.state.tick = parsed;
			} else {
				this.joinSession(window.location.hash.substr(1));
			}
		}
	}

	componentDidMount() {
		const world = this.parser.world;
		const worldSize = {
			width: world.boundaryMax.x - world.boundaryMin.x,
			height: world.boundaryMax.y - world.boundaryMin.y,
		};
		this.setState({worldSize});
	}

	setTickNow = (tick) => {
		this.lastFrameTime = 0;
		this.playStartTick = tick;
		this.playStartTime = window.performance.now();
		this.setState({tick});
		this.setHash(tick);
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'tick',
				session: this.sessionName,
				tick: tick
			}));
		}
	};

	setTick = throttle((tick) => {
		this.setTickNow(tick);
	}, 50);

	onTickInput = (event) => {
		this.setTick(parseInt(event.target.value, 10));
	};

	pause() {
		this.setState({playing: false});
		this.lastFrameTime = 0;
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'play',
				session: this.sessionName,
				play: false
			}));
		}
	}

	play() {
		this.playStartTick = this.state.tick;
		this.playStartTime = window.performance.now();
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
			if (this.session) {
				this.session.send(JSON.stringify({
					type: 'create',
					session: this.sessionName
				}));
				this.session.send(JSON.stringify({
					type: 'tick',
					session: this.sessionName,
					tick: this.state.tick
				}));
				this.session.send(JSON.stringify({
					type: 'play',
					session: this.sessionName,
					play: this.state.playing
				}));
			}
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
				this.session.send(JSON.stringify({
					type: 'join',
					session: name
				}));
				this.session.onmessage = (event) => {
					const packet = JSON.parse(event.data) as Packet;
					if (packet.type === 'tick') {
						this.setTickNow(packet.tick);
					}
					if (packet.type === 'play') {
						if (packet.play || packet.tick) {
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

	syncPlayTick = debounce(() => {
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'tick',
				session: this.sessionName,
				tick: this.state.tick
			}));
		}
	}, 500);

	setHash = debounce((tick) => {
		if (!this.session && this.props.isStored) {
			history.replaceState('', '', '#' + tick);
		}
	}, 250);

	animFrame = (timestamp) => {
		const timePassed = timestamp - this.playStartTime;
		const targetTick = this.playStartTick + (Math.round(timePassed * this.intervalPerTick));
		this.lastFrameTime = timestamp;
		if (targetTick >= (this.parser.ticks - 1)) {
			this.pause();
		}
		this.setHash(this.state.tick);
		this.setState({tick: targetTick});
		if (this.session) {
			this.syncPlayTick();
		}

		if (this.isSessionOwner && this.session && (this.lastTickSend + 60) < targetTick) {
			this.session.send(JSON.stringify({
				type: 'tick',
				session: this.sessionName,
				tick: targetTick
			}));
			this.lastTickSend = targetTick;
		}

		if (this.state.playing) {
			requestAnimationFrame(this.animFrame);
		}
	};

	render() {
		const players = this.parser.getPlayersAtTick(this.state.tick);
		const buildings = this.parser.getBuildingAtTick(this.state.tick);
		const playButtonText = (this.state.playing) ? '⏸' : '▶️';
		const disabled = (this.session && !this.isSessionOwner);

		return (
			<div>
				<div className="map-holder">
					<MapContainer contentSize={this.state.worldSize}
					              onScale={scale => this.setState({scale})}>
						<MapRender size={this.state.worldSize}
						           players={players}
						           buildings={buildings}
						           header={this.props.header}
						           world={this.parser.world}
						           scale={this.state.scale}/>
					</MapContainer>
					<AnalyseMenu sessionName={this.sessionName}
					             onShare={this.createSession}
					             canShare={this.props.isStored && !disabled}
					             isShared={this.state.isShared}
					/>
					<SpecHUD parser={this.parser} tick={this.state.tick}
					         players={players}/>
				</div>
				<div className="time-control">
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
