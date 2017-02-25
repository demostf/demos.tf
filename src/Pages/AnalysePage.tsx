import * as React from 'react';

import {Dropzone} from '../Components/Dropzone';
import {Analyser} from '../Analyse/Analyser';
import {Demo, Header} from 'tf2-demo/build/es6';

import './AboutPage.css';
import {DemoProvider} from "../Providers/DemoProvider";
import Spinner from 'react-spinner';

export interface AnalysePageState {
	demoFile: File|null;
	demo: Demo|null;
	header: Header|null;
	loading: boolean;
}

export interface AnalysePageProps {
	params: {
		id?: number;
	}
}

export class AnalysePage extends React.Component<AnalysePageProps, AnalysePageState> {
	static page = 'analyse';
	provider: DemoProvider;

	state: AnalysePageState = {
		demoFile: null,
		demo: null,
		header: null,
		loading: false
	};

	constructor(props) {
		super(props);
		this.provider = props.demoProvider;
	}

	onDrop = ([demoFile]) => {
		this.setState({demoFile, loading: true});
		const reader = new FileReader();
		reader.onload = () => {
			const buffer = reader.result as ArrayBuffer;
			const demo = new Demo(buffer);
			const header = demo.getParser().readHeader();
			this.setState({demo, header, loading: false});
		};
		reader.readAsArrayBuffer(demoFile);
	};

	componentDidMount() {
		if (this.props.params.id) {
			this.setState({loading: true});
			this.provider.getDemo(this.props.params.id).then((demo) => {
				return demo.url;
			}).then((url) => {
				return fetch(url, {mode: 'cors'});
			}).then((response) => {
				return response.arrayBuffer();
			}).then((buffer) => {
				const demo = new Demo(buffer);
				const header = demo.getParser().readHeader();
				this.setState({demo, header, loading: false});
			});
		}
	}

	render() {
		if (this.state.loading) {
			return <Spinner/>;
		}

		return (
			<div className="analyse-page">
				<p>To view a demo, select a file on your computer or use the "View" button on any demo stored on the site.</p>

				{(this.state.demo === null || this.state.header === null) ?
					<Dropzone onDrop={this.onDrop} text="Drop file or click to select"/>:
					<Analyser demo={this.state.demo}
					          header={this.state.header}
					          isStored={!!this.props.params.id}
					/>
				}
			</div>
		);
	}
}
