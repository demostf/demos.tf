import * as React from 'react';

import {Dropzone} from '../Components/Dropzone';
import {Analyser} from '../Analyse/Analyser';
import {Demo, Header} from 'tf2-demo/build/es6';

import './AboutPage.css';

export interface AnalysePageState {
	demoFile: File|null;
	demo: Demo|null;
	header: Header|null;
}

export interface AnalysePageProps {
}

export class AnalysePage extends React.Component<AnalysePageProps, AnalysePageState> {
	static page = 'analyse';

	state: AnalysePageState = {
		demoFile: null,
		demo: null,
		header: null
	};

	onDrop = ([demoFile]) => {
		this.setState({demoFile});
		const reader = new FileReader();
		reader.onload = () => {
			const buffer = reader.result as ArrayBuffer;
			const demo = new Demo(buffer);
			const header = demo.getParser().readHeader();
			this.setState({demo, header});
		};
		reader.readAsArrayBuffer(demoFile);
	};

	render() {
		return (
			<div>
				{(this.state.demo === null || this.state.header === null) ?
					<Dropzone onDrop={this.onDrop}/>:
					<Analyser demo={this.state.demo}
					          header={this.state.header}
					/>
				}
			</div>
		);
	}
}
