import {Viewport, Point} from './Viewport';

export interface CenteredPanZoomOptions {
	screenWidth: number;
	screenHeight: number;
	scale?: number;
	contentSize: {
		width: number;
		height: number;
	}
}

export class CenteredPanZoom {
	screen: Viewport;
	viewport: Viewport;
	scale: number;
	contentSize: {
		width: number;
		height: number;
	};

	constructor(options: CenteredPanZoomOptions) {
		this.screen = new Viewport({
			x: 0,
			y: 0,
			width: options.screenWidth,
			height: options.screenHeight
		});
		this.viewport = new Viewport({
			x: 0,
			y: 0,
			width: options.screenWidth,
			height: options.screenHeight
		});
		this.scale = options.scale || 1;
		this.contentSize = options.contentSize;
	}

	setSize(width, height) {
		this.screen.width = width;
		this.screen.height = height;
		this.viewport.width = width * this.scale;
		this.viewport.height = height * this.scale;
		this.constrainPan(true);
	}

	setContentSize(width, height) {
		this.contentSize = {width, height};
		this.constrainPan(true);
	}

	pan(screenX, screenY) {
		this.viewport.x = this.viewport.x + screenX;
		this.viewport.y = this.viewport.y + screenY;
		this.constrainPan();
	}

	constrainPan(strict = false) {
		const minX = (strict) ? 0 : this.screen.width * 0.5;
		const minY = (strict) ? 0 : this.screen.height * 0.5;
		this.viewport.x = Math.min(minX, this.viewport.x);
		this.viewport.y = Math.min(minY * 0.5, this.viewport.y);
		const maxY = (this.screen.height - (this.contentSize.height * this.scale)) - (strict ? 0 : this.screen.height * 0.5);
		const maxX = (this.screen.width - (this.contentSize.width * this.scale)) - (strict ? 0 : this.screen.width * 0.5);
		this.viewport.y = Math.max(maxY, this.viewport.y);
		this.viewport.x = Math.max(maxX, this.viewport.x);
		if (maxY > ((strict) ? 0 : this.screen.height * 0.5)) {
			this.viewport.y = Math.floor(maxY / 2);
		}
		if (maxX > ((strict) ? 0 : this.screen.width * 0.5)) {
			this.viewport.x = Math.floor(maxX / 2);
		}
	}

	panFrom(screenStart: Point, screenEnd: Point) {
		this.pan(screenEnd.x - screenStart.x, screenEnd.y - screenStart.y);
	}

	//find zoom point in pre-zoom viewport
	//make that point the same in the post-zoom viewport
	zoom(scale: number, screenCenter: Point) {
		const v1 = Viewport.convert(screenCenter, {
			from: this.screen,
			to: this.viewport
		});
		this.viewport.x = this.viewport.x * (scale / this.scale);
		this.viewport.y = this.viewport.y * (scale / this.scale);
		this.viewport.width = this.screen.width * scale;
		this.viewport.height = this.screen.height * scale;
		const minScale = Math.min(this.screen.width / this.contentSize.width, this.screen.height / this.contentSize.height);
		scale = Math.max(minScale, scale);
		this.scale = scale;

		const v2 = Viewport.convert(screenCenter, {
			from: this.screen,
			to: this.viewport
		});
		const deltaX = v2.x - v1.x;
		const deltaY = v2.y - v1.y;
		this.pan(deltaX * scale, deltaY * scale);
	}
}
