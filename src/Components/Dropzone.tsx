import * as React from 'react';
import DropZone from 'react-dropzone';

import './Dropzone.css';

export interface DropzoneProps {
	onDrop: (accepted: File[], rejected: File[]) => any;
	text?: string;
}

export function DemoDropZone(props: DropzoneProps) {
	return (
		<DropZone onDrop={props.onDrop}>
			{({getRootProps, getInputProps}) => <button className="dropzone" {...getRootProps()}>{this.state.message}
				{props.text ? props.text : 'Drop files or click to upload'}<input {...getInputProps()}/></button>}
		</DropZone>
	);
}
