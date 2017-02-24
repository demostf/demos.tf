import * as React from 'react';
import {MapRender} from './MapRender';
import {Demo, Header} from 'tf2-demo/build/es6';
import {MapContainer} from "./MapContainer";
import {Parser} from "./Data/Parser";
import {throttle} from 'lodash';
import {Timeline} from './Render/Timeline';
import {SpecHUD} from './Render/SpecHUD';
import {debounce} from 'lodash';

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
}

export class Analyser extends React.Component<AnalyseProps, {}> {
	parser: Parser;

	state: AnalyseState = {
		worldSize: {
			width: 0,
			height: 0
		},
		tick: 0,
		playing: false,
		scale: 1
	};

	constructor(props: AnalyseProps) {
		super(props);
		this.parser = new Parser(props.demo, props.header);
		this.parser.cacheData();
		if (props.isStored && window.location.hash) {
			this.state.tick = parseInt(window.location.hash.substr(1), 10);
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
	}, 50);

	onTickInput = (event) => {
		this.setTick(parseInt(event.target.value, 10));
	};

	pause() {
		this.setState({playing: false});
	}

	play() {
		this.setState({playing: true});
		requestAnimationFrame(this.animFrame);
	}

	togglePlay = () => {
		if (this.state.playing) {
			this.pause();
		} else {
			this.play();
		}
	};

	setHash = debounce((tick) => {
		history.replaceState('', '', '#' + tick);
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
		const {header} = this.props;
		const players = this.parser.getPlayersAtTick(this.state.tick);
		const playButtonText = (this.state.playing) ? '⏸' : '▶️';

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
					<SpecHUD parser={this.parser} tick={this.state.tick}
					         players={players}/>
					<input className="play-pause-button" type="button"
					       onClick={this.togglePlay}
					       value={playButtonText}/>
					<Timeline parser={this.parser} tick={this.state.tick}
					          onSetTick={this.setTick}/>
				</div>
			</div>
		);
	}
}
