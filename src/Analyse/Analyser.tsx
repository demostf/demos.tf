import * as React from 'react';
import {MapRender} from './MapRender';
import {MapContainer} from "./MapContainer";
import {throttle, debounce} from 'throttle-debounce';
import {Timeline} from './Render/Timeline';
import {SpecHUD} from './Render/SpecHUD';
import {AnalyseMenu} from './AnalyseMenu'
import {Header} from "@demostf/parser-worker";

import './Analyser.css'
import {AsyncParser} from "./Data/AsyncParser";
import {getMapBoundaries} from "./MapBoundries";
import {WorldBoundaries} from "@demostf/parser-worker/pkg";

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
	backgroundBoundaries: WorldBoundaries;
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
	owner_token?: string;
	isSessionOwner = false;
	sessionName: string;

	state: AnalyseState = {
		worldSize: {
			width: 0,
			height: 0
		},
		backgroundBoundaries: {
			boundary_min: {
				x: 0, y: 0, free: () => {
				}
			},
			boundary_max: {
				x: 0, y: 0, free: () => {
				}
			},
			free: () => {
			}
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
		this.intervalPerTick = props.header.interval_per_tick;
		this.sessionName = generateSession();
		if (props.isStored && window.location.hash) {
			const parsed = parseInt(window.location.hash.substr(1), 10);
			if (('#' + parsed) === window.location.hash) {
				this.state.tick = Math.floor(parsed / 2);
			} else {
				this.joinSession(window.location.hash.substr(1));
			}
		}
	}

	componentDidMount() {
		const map = this.parser.demo.header.map;

		const backgroundBoundaries = getMapBoundaries(map);
		if (!backgroundBoundaries) {
			throw new Error(`Map not supported "${map}".`);
		}
		const worldSize = {
			width: backgroundBoundaries.boundary_max.x - backgroundBoundaries.boundary_min.x,
			height: backgroundBoundaries.boundary_max.y - backgroundBoundaries.boundary_min.y,
		};
		this.setState({worldSize, backgroundBoundaries});
	}

	setTickNow(tick) {
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
	}

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
		requestAnimationFrame(this.animFrame.bind(this));
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'play',
				session: this.sessionName,
				play: true
			}));
		}
	}

	createSession() {
		if (this.session) {
			return;
		}
		this.isSessionOwner = true;
		this.setState({isShared: true});
		this.owner_token = generateSession();
		this.openSession();
	}

	openSession() {
		this.session = new WebSocket(syncUri);
		this.session.onopen = () => {
			if (this.session) {
				this.session.send(JSON.stringify({
					type: 'create',
					session: this.sessionName,
					token: this.owner_token
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
		};
		this.session.onclose = () => {
			this.session = undefined;
			setTimeout(this.openSession.bind(this), 250);
		};
		this.session.onerror = () => {
			this.session = undefined;
			setTimeout(this.openSession.bind(this), 250);
		};
	}

	joinSession(name: string) {
		if (this.session) {
			return;
		}
		this.sessionName = name;
		this.session = new WebSocket(syncUri);
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
		};
		this.session.onclose = () => {
			this.session = undefined;
			setTimeout(() => this.joinSession(this.sessionName), 250);
		};
		this.session.onerror = () => {
			this.session = undefined;
			setTimeout(() => this.joinSession(this.sessionName), 250);
		};
	}

	togglePlay() {
		if (this.state.playing) {
			this.pause();
		} else {
			this.play();
		}
	}

	private syncPlayTick = debounce(500, () => {
		if (this.session && this.isSessionOwner) {
			this.session.send(JSON.stringify({
				type: 'tick',
				session: this.sessionName,
				tick: this.state.tick
			}));
		}
	});

	private setHash = debounce(250, (tick) => {
		if (!this.session && this.props.isStored) {
			history.replaceState('', '', '#' + tick * 2);
		}
	});

	animFrame(timestamp) {
		const timePassed = timestamp - this.playStartTime;
		const targetTick = this.playStartTick + (Math.round(timePassed * this.intervalPerTick * 2));
		this.lastFrameTime = timestamp;
		if (targetTick >= (this.parser.demo.tickCount - 1)) {
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
			requestAnimationFrame(this.animFrame.bind(this));
		}
	}

	render() {
		const players = this.parser.getPlayersAtTick(this.state.tick);
		const playButtonText = (this.state.playing) ? '⏸' : '▶️';
		const disabled = (this.session && !this.isSessionOwner);

		return (
			<div>
				<div className="map-holder">
					<MapContainer contentSize={this.state.worldSize}
								  onScale={scale => this.setState({scale})}>
						<MapRender size={this.state.worldSize}
								   players={players}
								   header={this.props.header}
								   world={this.state.backgroundBoundaries}
								   scale={this.state.scale}/>
					</MapContainer>
					<AnalyseMenu sessionName={this.sessionName}
								 onShare={this.createSession.bind(this)}
								 canShare={this.props.isStored && !disabled}
								 isShared={this.state.isShared}
					/>
					<SpecHUD parser={this.parser} tick={this.state.tick}
							 players={players}/>
				</div>
				<div className="time-control"
					 title={`${tickToTime(this.state.tick)} (tick ${this.state.tick * 2})`}>
					<input className="play-pause-button" type="button"
						   onClick={this.togglePlay.bind(this)}
						   value={playButtonText}
						   disabled={disabled}
					/>
					<Timeline parser={this.parser} tick={this.state.tick}
							  onSetTick={throttle(50, (tick) => {
								  this.setTickNow(tick);
							  })}
							  disabled={disabled}/>
				</div>
			</div>
		);
	}
}

function tickToTime(tick: number): string {
	let seconds = Math.floor(tick / 33);
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
