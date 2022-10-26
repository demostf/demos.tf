import {edit, count_ticks} from "@demostf/edit";

export interface EditOptions {
	unlock_pov: boolean,
	cut?: TickRange,
}

export interface TickRange {
	from: number,
	to: number,
}

declare function postMessage(message: any, transfer?: any[]): void;

/**
 * @global postMessage
 * @param event
 */
onmessage = (event: MessageEvent) => {
	if (event.data.count) {
		const buffer: ArrayBuffer = event.data.buffer;
		const bytes = new Uint8Array(buffer);
		count_ticks(bytes).then(ticks => {
			postMessage({
				ticks: ticks
			});
		}).catch(e => {
			postMessage({
				error: e
			});
		});
	} else {
		const buffer: ArrayBuffer = event.data.buffer;
		const options: EditOptions = event.data.options;
		const bytes = new Uint8Array(buffer);
		edit(bytes, options).then(edited => {
			postMessage({
				buffer: edited.buffer
			}, [edited.buffer]);
		}).catch(e => {
			postMessage({
				error: e
			});
		});
	}
};
