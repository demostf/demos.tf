import * as React from 'react';
import {Panner} from "../Components/Panner/Panner";

import './MapContainer.css';

export class MapContainerProps {
	children?: any;
	contentSize: {
		width: number;
		height: number;
	};
	onScale?: (scale: number) => any;
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
	sendScale = false;

	componentDidMount() {
		if (this.container.clientWidth == this.state.width && this.container.clientHeight == this.state.height) {
			return;
		}
		this.setState({
			height: this.container.clientHeight,
			width: this.container.clientWidth
		});
	}

	render() {
		const scale = Math.min(this.state.width / this.props.contentSize.width, this.state.height / this.props.contentSize.height);
		if (!this.sendScale && this.props.onScale) {
			if (isFinite(scale)) {
				setTimeout(() => {
					this.props.onScale && this.props.onScale(scale);
					this.sendScale = true;
				}, 1);
			}
		}

		return (
			<div className="map-container" ref={(div) => this.container=div}>
				<Panner width={this.state.width} height={this.state.height}
				        scale={scale} contentSize={this.props.contentSize}
				        onScale={this.props.onScale}>
					{this.props.children}
				</Panner>
			</div>
		)
	}
}
