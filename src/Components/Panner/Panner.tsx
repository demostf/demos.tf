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
	};
	onScale?: (scale: number) => any;
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
		if (
			width == this.panner.screen.width && height == this.panner.screen.height) {
			return;
		}
		this.panner.scale = scale;
		this.panner.setSize(width, height);
		this.panner.setContentSize(contentSize.width, contentSize.height);
		this.setState({scale});
		this.setState({
			translate: {
				x: this.panner.viewport.x,
				y: this.panner.viewport.y
			},
			scale: this.panner.scale
		});
	}

	render() {
		const style = {
			transform: `translate(${this.state.translate.x}px, ${this.state.translate.y}px) scale(${this.state.scale})`,
			transformOrigin: 'top left'
		};
		const center = {
			x: Math.floor(this.panner.screen.width / 2),
			y: Math.floor(this.panner.screen.height / 2)
		};
		const setZoomFactor = this.zoomFactor;
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
				<div className="zoommenu">
					<div className="plus"
					     onClick={()=>{setZoomFactor(1.10, center)}}>+
					</div>
					<div className="minus"
					     onClick={()=>{setZoomFactor(0.90, center)}}>
						-
					</div>
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

	zoomFactor = (zoomFactor, point) => {
		const newScale = this.state.scale * zoomFactor;

		this.panner.zoom(newScale, point);
		this.setState({
			translate: {
				x: this.panner.viewport.x,
				y: this.panner.viewport.y
			},
			scale: this.panner.scale
		});
		if (this.props.onScale) {
			this.props.onScale(this.panner.scale);
		}
	};

	_onWheel = (event) => {
		event.preventDefault();
		const center = {x: event.pageX, y: event.pageY};
		if (event.deltaY < 0) {
			this.zoomFactor(1.05, center);
		} else {
			this.zoomFactor(0.95, center);
		}
	};
}
