import * as React from 'react';
import {MapRender} from './MapRender';
import {Demo, Header} from 'tf2-demo/build/es6';
import {MapContainer} from "./MapContainer";
import {Parser} from "./Data/Parser";
import {debounce, throttle} from 'lodash';
import {getMapBoundaries} from "./MapBoundries";
import {Timeline} from './Render/Timeline';

export interface AnalyseProps {
	demo: Demo;
	header: Header;
}

export interface AnalyseState {
	worldSize: {
		width: number;
		height: number;
	}
	tick: number;
	playing: boolean;
}

export class Analyser extends React.Component<AnalyseProps, {}> {
	parser: Parser;

	state: AnalyseState = {
		worldSize: {
			width: 0,
			height: 0
		},
		tick: 0,
		playing: false
	};

	constructor(props: AnalyseProps) {
		super(props);
		this.parser = new Parser(props.demo, props.header);
		this.parser.cacheData();
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
	}, 250);

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

	animFrame = () => {
		if (this.state.tick === (this.parser.ticks - 1)) {
			this.pause();
		}
		this.setState({tick: this.state.tick + 1});

		if (this.state.playing) {
			requestAnimationFrame(this.animFrame);
		}
	};

	render() {
		const {header} = this.props;
		const players = this.parser.getPlayersAtTick(this.state.tick);
		const playButtonText = (this.state.playing) ? 'Pause' : 'Play';
		return (
			<div>
				<h1>{header.server}</h1>
				<MapContainer contentSize={this.state.worldSize}>
					<MapRender size={this.state.worldSize} players={players}
					           header={this.props.header}
					           world={this.props.demo.getParser().match.world}/>
				</MapContainer>
				<Timeline parser={this.parser} tick={this.state.tick}/>
				<input type="button" onClick={this.togglePlay}
				       value={playButtonText}/>
				<input value={this.state.tick} type="range" min={0}
				       max={this.parser.ticks}
				       onChange={this.onTickInput}/>
			</div>
		);
	}
}
