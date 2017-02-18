import * as React from 'react';
import * as DropZone from 'react-dropzone';

import './Dropzone.css';

export interface DropzoneProps {
	onDrop: Function;
	text?: string;
}

export function Dropzone(props: DropzoneProps) {
	return (
		<DropZone onDrop={props.onDrop}
		          className="dropzone">
			{props.text ? props.text : 'Drop files or click to upload'}
		</DropZone>
	);
}
