import * as React from 'react';
import {CenteredPanZoom} from './CenteredPanZoom';

import './Panner.css';

export interface PannerState {
	scale: number;
	translate: {
		x: number;
		y: number;
	}
}

export interface PannerProps {
	width: number;
	height: number;
	scale: number;
	contentSize: {
		width: number;
		height: number;
	}
}

export class Panner extends React.Component<PannerProps, PannerState> {
	private startX = 0;
	private startY = 0;
	private panner: CenteredPanZoom;

	state: PannerState = {
		scale: 0,
		translate: {
			x: 0,
			y: 0
		}
	};

	constructor(props) {
		super(props);
		this.panner = new CenteredPanZoom({
			screenHeight: this.props.height,
			screenWidth: this.props.width,
			scale: this.props.scale,
			contentSize: props.contentSize
		});
	}

	componentDidMount() {
		this.setState({
			translate: {
				x: this.panner.viewport.x,
				y: this.panner.viewport.y
			},
			scale: this.panner.scale
		});
	}

	componentWillReceiveProps({width, height, scale, contentSize}:PannerProps) {
		this.panner.scale = scale;
		this.panner.setSize(width, height);
		this.panner.setContentSize(contentSize.width, contentSize.height);
		this.setState({scale});
	}

	render() {
		const style = {
			transform: `translate(${this.state.translate.x}px, ${this.state.translate.y}px) scale(${this.state.scale})`,
			transformOrigin: 'top left'
		};
		return (
			<div className="pan-zoom-element"
			     ref="element"
			     style={{width: this.props.width, height: this.props.height}}
			     onMouseDown={this._onMouseDown}
			     onWheel={this._onWheel}>
				<div ref="content" className="content-container noselect"
				     style={style}>
					{this.props.children}
				</div>
			</div>
		);
	}

	_onMouseDown = (event) => {
		this.startX = event.pageX;
		this.startY = event.pageY;
		document.addEventListener('mouseup', this._onMouseUp, true);
		document.addEventListener('mousemove', this._onMouseMove, true);
	};

	_onMouseUp = () => {
		document.removeEventListener('mouseup', this._onMouseUp, true);
		document.removeEventListener('mousemove', this._onMouseMove, true);
	};

	_onMouseMove = (event) => {
		const {pageX, pageY} = event;
		this.panner.panFrom(
			{
				x: this.startX,
				y: this.startY
			},
			{
				x: pageX,
				y: pageY
			}
		);
		this.startX = event.pageX;
		this.startY = event.pageY;
		this.setState({
			translate: {
				x: this.panner.viewport.x,
				y: this.panner.viewport.y
			},
			scale: this.panner.scale
		});
	};

	_onWheel = (event) => {
		event.preventDefault();
		let zoomFactor;
		if (event.deltaY < 0) {
			zoomFactor = this.state.scale * 1.05;
		} else {
			zoomFactor = this.state.scale * 0.95;
		}
		this.panner.zoom(zoomFactor, {x: event.pageX, y: event.pageY});
		this.setState({
			translate: {
				x: this.panner.viewport.x,
				y: this.panner.viewport.y
			},
			scale: this.panner.scale
		});
	};
}
