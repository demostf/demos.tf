import {Viewport, Point} from './Viewport';

export interface CenteredPanZoomOptions {
	screenWidth: number;
	screenHeight: number;
	scale?: number;
}

export class CenteredPanZoom {
	screen: Viewport;
	viewport: Viewport;
	scale: number;

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
	}

	setSize(width, height) {
		this.viewport.width = width * this.scale;
		this.viewport.height = height * this.scale;
	}

	pan(screenX, screenY) {
		this.viewport.x = Math.min(0, this.viewport.x + screenX);
		this.viewport.y = Math.min(0, this.viewport.y + screenY);
		const maxY = (this.viewport.height - this.screen.height);
		const maxX = (this.viewport.width - this.screen.width);
		// console.log(maxY);
		// this.viewport.y = Math.max(maxY, this.viewport.y);
		// this.viewport.x = Math.max(maxX, this.viewport.x);
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
