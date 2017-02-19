import * as React from 'react';
import {Panner} from "../Components/Panner/Panner";

export class MapContainerProps {
	children?: any;
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
		this.setState({
			height: this.container.clientHeight,
			width: this.container.clientWidth
		})
	}

	render() {
		console.log(this.state);
		return (
			<div className="map-container" ref={(div) => this.container=div}>
				<Panner width={this.state.width} height={this.state.height}>
					{this.props.children}
				</Panner>
			</div>
		)
	}
}
