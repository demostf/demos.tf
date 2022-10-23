import {edit} from "@demostf/edit";

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

};
