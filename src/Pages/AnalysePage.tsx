import * as React from 'react';

import {Dropzone} from '../Components/Dropzone';
import {Analyser} from '../Analyse/Analyser';
import {Demo, Header} from 'tf2-demo/build/es6';

import './AboutPage.css';
import {DemoProvider} from "../Providers/DemoProvider";
import Spinner from 'react-spinner';
import {AsyncParser} from "../Analyse/Data/AsyncParser";

export interface AnalysePageState {
	demoFile: File|null;
	demo: Demo|null;
	header: Header|null;
	loading: boolean;
	error?: string;
	parser: AsyncParser|null;
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
		loading: false,
		parser: null
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
			this.handleBuffer(buffer);
		};
		reader.readAsArrayBuffer(demoFile);
	};

	handleBuffer(buffer: ArrayBuffer) {
		try {
			const parser = new AsyncParser(buffer);
			parser.cache().then(() => {
				this.setState({
					header: parser.header,
					loading: false,
					parser
				});
			});
		}
		catch (e) {
			this.setState({error: e.message});
		}
	}

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
				this.handleBuffer(buffer)
			});
		}
	}

	isSupported() {
		return Math.log2 && ('Uint8Array' in window);
	}

	render() {
		if (this.state.error) {
			return <div className="error-holder">
				<div className="error-image">Something broke...</div>
				<div className="error">
					{this.state.error}
					<div className="error-hint">
						You can report issues on <a
						href="https://github.com/demostf/demos.tf/issues">github</a>.
					</div>
				</div>
			</div>;
		}

		if (this.state.loading) {
			return <Spinner/>;
		}

		return (
			<div className="analyse-page">
				<p>
					To view a demo, select a file on your computer or use the "View" button on any demo stored on the site.
				</p>
				{(this.state.header === null || this.state.parser === null) ?
					<Dropzone onDrop={this.onDrop}
					          text="Drop file or click to select"/>:
					<Analyser header={this.state.header}
					          isStored={!!this.props.params.id}
					          parser={this.state.parser}
					/>
				}
			</div>
		);
	}
}
