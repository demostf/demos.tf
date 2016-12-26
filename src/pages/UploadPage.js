import React, {Component, PropTypes} from 'react';

import {Section} from '../components/Section.js';
import {Duration} from '../components/Duration.js';
import {DemoProvider} from '../Providers/DemoProvider.js';
import DropZone from 'react-dropzone';
import {Footer} from '../components/Footer.js';
import {PluginSection} from '../components/PluginSection.js';
import 'dataview-getstring';

require('./UploadPage.css');
require('./DemoPage.css');

function parseHeader(file, cb) {
	const reader = new FileReader();

	reader.onload = function () {
		const view = new DataView(reader.result);
		cb({
			'type'    : view.getString(0, 8),
			'server'  : view.getString(16, 260),
			'nick'    : view.getString(276, 260),
			'map'     : view.getString(536, 260),
			'game'    : view.getString(796, 260),
			'duration': view.getFloat32(1056, true)
		});
	};

	reader.readAsArrayBuffer(file);
}

export class UploadPage extends Component {
	static page = 'upload';

	static contextTypes = {
		router: PropTypes.object
	};

	state = {
		demoInfo: null,
		demoFile: null,
		demoName: null,
		names   : {red: '', blue: ''},
		loading : false
	};

	constructor(props) {
		super(props);
		this.provider = new DemoProvider();
	}

	componentDidMount() {
		document.title = "Upload - demos.tf";
	}

	onDrop = (files) => {
		var file = files[0];
		this.handleDemo(file);
	};

	extractTeamNames = function (name) {
		const matches = name.match(/(\w+)_vs_(\w+)/);
		if (matches) {
			return {
				red : matches[2].toUpperCase(),
				blue: matches[1].toUpperCase()
			}
		} else {
			return null;
		}
	};

	handleDemo = (file) => {
		this.setState({demoName: file.name, demoFile: file});
		parseHeader(file, head => {
				console.log(head);
				if (head.type === 'HL2DEMO') {
					const names = this.extractTeamNames(file.name);
					if (names) {
						this.setState({names});
					}
					this.setState({demoInfo: head});
				} else {
					this.setState({demoInfo: null});
				}
			}
		)
	};

	upload = async() => {
		this.setState({loading: true});
		const id = await this.provider.uploadDemo(this.props.user.key, this.state.names.red || 'RED',
			this.state.names.blue || 'BLU', this.state.demoInfo.name, this.state.demoFile);
		this.setState({loading: false});
		if (id) {
			this.context.router.transitionTo('/' + id);
		}
	};

	render() {
		let demoInfo = [];
		if (this.state.demoInfo) {
			demoInfo = (
				<div className="demo-info">
					{this.state.demoInfo.map}
					<Duration className="time"
							  duration={Math.floor(this.state.demoInfo.duration)} />
				</div>
			);
		}
		return (
			<div>
				<section className="upload">
					<div className="teams">
						<div className="red">
							<input type="text" name="red"
								   placeholder="RED" />
						</div>
						<div className="blue">
							<input type="text" name="blue"
								   placeholder="BLU" />
						</div>
						<div id="clearfix" />
					</div>
					<DropZone onDrop={this.onDrop}
							  className="dropzone">
						{this.state.demoName ? this.state.demoName : 'Drop files or click to upload'}
					</DropZone>
					{demoInfo}
					<button onClick={this.upload}
							className="pure-button pure-button-primary"
							disabled={(this.state.demoInfo == null) || this.state.loading}>
						Upload
					</button>
				</section>
				<Section title="API Key">
					<pre>{this.props.user.key}</pre>
				</Section>

				<PluginSection user={this.props.user} />
				<Footer />
			</div>
		);
	}
}
