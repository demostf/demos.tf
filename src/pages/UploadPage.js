import React, {Component, PropTypes} from 'react';
import {Router} from 'react-router';

import DocumentTitle from 'react-document-title';
import {Section} from '../components/Section.js';
import {Duration} from '../components/Duration.js';
import {DemoProvider} from '../Providers/DemoProvider.js';
import DropZone from 'react-dropzone';
import Demo from 'tf2-demo';
import {Footer} from '../components/Footer.js';
import {PluginSection} from '../components/PluginSection.js';

require('./UploadPage.css');

export class UploadPage extends Component {
	static page = 'upload';

	static contextTypes = {
		router: PropTypes.object
	};

	state = {
		demoInfo: null,
		demoFile: null,
		demoName: null,
		names: {red: '', blue: ''},
		loading: false
	};

	constructor (props) {
		super(props);
		this.provider = new DemoProvider();
	}

	onDrop = (files)=> {
		var file = files[0];
		this.handleDemo(file);
	};

	extractTeamNames = function (name) {
		var matches = name.match(/(\w+)_vs_(\w+)/);
		if (matches) {
			return {
				red: matches[2].toUpperCase(),
				blue: matches[1].toUpperCase()
			}
		} else {
			return null;
		}
	};

	readDemo (file, cb) {
		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function (theFile) {
			return function (buffer) {
				var demo = new Demo(buffer.target.result);
				var parser = demo.getParser();
				try {
					var head = parser.readHeader();
					cb(head);
				} catch (e) {
					cb(null);
				}
			};
		})(file);

		// Read in the image file as a data URL.
		reader.readAsArrayBuffer(file);
	}

	handleDemo = (file)=> {
		this.setState({demoName: file.name, demoFile: file});
		this.readDemo(file, head => {
				if (head.type === 'HL2DEMO') {
					var names = this.extractTeamNames(file.name);
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
		var id = await this.provider.uploadDemo(this.props.user.key, this.state.names.red || 'RED',
			this.state.names.blue || 'BLU', this.state.demoInfo.name, this.state.demoFile);
		this.setState({loading: false});
		if (id) {
			this.context.router.transitionTo('/' + id);
		}
	};

	render () {
		var demoInfo = [];
		if (this.state.demoInfo) {
			demoInfo = (
				<div className="demo-info">
					{this.state.demoInfo.map}
					<Duration className="time"
							  duration={Math.floor(this.state.demoInfo.duration)}/>
				</div>
			);
		}
		return (
			<DocumentTitle title="Upload - demos.tf">
				<div>
					<section className="upload">
						<div className="teams">
							<div className="red">
								<input type="text" name="red"
									   placeholder="RED"/>
							</div>
							<div className="blue">
								<input type="text" name="blue"
									   placeholder="BLU"/>
							</div>
							<div id="clearfix"/>
						</div>
						<DropZone onDrop={this.onDrop}
								  className="dropzone">
							{this.state.demoName ? this.state.demoName : 'Drop files or click to upload'}
						</DropZone>
						{demoInfo}
						<button onClick={this.upload}
								className="pure-button pure-button-primary"
								disabled={(this.state.demoInfo==null) || this.state.loading}>
							Upload
						</button>
					</section>
					<Section title="API Key">
						<pre>{this.props.user.key}</pre>
					</Section>

					<PluginSection user={this.props.user}/>
					<Footer/>
				</div>
			</DocumentTitle>
		);
	}
}
