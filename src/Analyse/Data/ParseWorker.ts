import {parseDemo} from "@demostf/parser-worker";

declare function postMessage(message: any, transfer?: any[]): void;

/**
 * @global postMessage
 * @param event
 */
onmessage = (event: MessageEvent) => {
	const buffer: ArrayBuffer = event.data.buffer;
	const bytes = new Uint8Array(buffer);
	parseDemo(bytes, (progress) => {
		postMessage({
			progress
		});
	}).then(parsed => {
		postMessage({
			demo: parsed
		}, [parsed.data.buffer]);
	}).catch(e => {
		console.error(e);
		postMessage({
			error: e.message
		});
	});

};
