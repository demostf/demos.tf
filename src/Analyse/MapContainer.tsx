import * as React from 'react';
import {Panner} from "../Components/Panner/Panner";

import './MapContainer.css';

export class MapContainerProps {
	children?: any;
	contentSize: {
		width: number;
		height: number;
	};
}

export class MapContainerState {
	width: number;
	height: number;
}

export class MapContainer extends React.Component<MapContainerProps,MapContainerState> {
	container: Element;
	state: MapContainerState = {
		width: 500,
		height: 800
	};

	componentDidMount() {
		console.log(this.container.clientHeight);
		this.setState({
			height: this.container.clientHeight,
			width: this.container.clientWidth
		})
	}

	render() {
		const scale = this.state.width / this.props.contentSize.width;

		return (
			<div className="map-container" ref={(div) => this.container=div}>
				<Panner width={this.state.width} height={this.state.height}
				        scale={scale} contentSize={this.props.contentSize}>
					{this.props.children}
				</Panner>
			</div>
		)
	}
}
