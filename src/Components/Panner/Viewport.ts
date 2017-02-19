export interface ViewPortOptions {
	x?: number;
	y?: number;
	width: number;
	height: number;
}

export interface Point {
	x: number;
	y: number;
}

export class Viewport {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(options: ViewPortOptions) {
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.width = options.width;
		this.height = options.height;
	}

	static convert(point: Point, {from, to}: {from: Viewport, to: Viewport}): Point {
		const widthScale = from.width / to.width;
		const heightScale = from.height / to.height;

		return {
			x: point.x * widthScale - to.x * widthScale,
			y: point.y * heightScale - to.y * heightScale
		};
	}
}

