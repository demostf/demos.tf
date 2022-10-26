import * as React from 'react';

import {Duration, formatDuration} from '../Components/Duration';
import {DemoDropZone} from '../Components/Dropzone';
import {Footer} from '../Components/Footer';
import 'dataview-getstring';

import './EditPage.css';
import {User} from "../Providers/AuthProvider";
import Element = JSX.Element;
import {NavigateFunction} from "react-router-dom";
import {DemoHead, GetStringDataView, parseHeader, readFile} from "./UploadPage";
import {EditOptions} from "../EditWorker";
import {Section} from "../Components/Section";
import MultiRangeSlider from "../Components/MultiSlider";

export interface EditPageState {
	loading: boolean;
	demoInfo: null | DemoHead;
	demoName: string;
	demoFile: File | null;
	error: null | string;
	unlockPov: boolean;
	cut: { from: number, to: number };
	intervalPerTick: number;
}

export interface UploadPageProps {
	user: User;
	navigate: NavigateFunction;
}

export function edit(data: ArrayBuffer, options: EditOptions): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const worker = new Worker(new URL('../EditWorker.ts', import.meta.url));
		worker.postMessage({
			buffer: data,
			options
		}, [data]);
		worker.onmessage = (event) => {
			if (event.data.error) {
				reject(event.data.error);
				return;
			} else if (event.data.buffer) {
				resolve(event.data.buffer);
			}
		}
	});
}

export function count_ticks(data: ArrayBuffer): Promise<number> {
	return new Promise((resolve, reject) => {
		const worker = new Worker(new URL('../EditWorker.ts', import.meta.url));
		worker.postMessage({
			buffer: data,
			count: true
		}, [data]);
		worker.onmessage = (event) => {
			if (event.data.error) {
				reject(event.data.error);
				return;
			} else if (event.data.ticks) {
				resolve(event.data.ticks);
			}
		}
	});
}

function downloadBuffer(arrayBuffer: ArrayBuffer, fileName: string) {
	const a = document.createElement('a')
	a.href = URL.createObjectURL(new Blob(
		[arrayBuffer],
	))
	a.download = fileName
	a.click()
}

export default class EditPage extends React.Component<UploadPageProps, EditPageState> {
	static page = 'upload';

	state: EditPageState = {
		demoInfo: null,
		demoFile: null,
		demoName: '',
		loading: false,
		error: null,
		unlockPov: false,
		cut: {from: 0, to: 0},
		intervalPerTick: 0.166666,
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		document.title = "Edit - demos.tf";
	}

	onDrop(files) {
		const file = files[0];
		this.handleDemo(file);
	}

	handleDemo(file) {
		this.setState({demoName: file.name, demoFile: file, loading: true});
		parseHeader(file, head => {
				if (head.type === 'HL2DEMO') {
					if (head.ticks === 0) {
						console.log("counting ticks");
						readFile(file).then(count_ticks).then(ticks => {
							console.log(ticks);
							head.ticks = ticks;
							this.setState({
								demoInfo: head,
								cut: {from: 0, to: ticks},
								intervalPerTick: head.duration / ticks,
								loading: false,
							});
						});
					} else {
						this.setState({
							demoInfo: head,
							cut: {from: 0, to: head.ticks},
							intervalPerTick: head.duration / head.ticks,
							loading: false,
						});
					}
				} else {
					this.setState({demoInfo: null});
				}
			}
		)
	}

	async edit() {
		this.setState({loading: true});
		if (this.state.demoInfo && this.state.demoFile) {
			try {
				let options = {
					unlock_pov: this.state.unlockPov,
					cut: (this.state.cut.from > 0 || this.state.cut.to < this.state.demoInfo.ticks) ? this.state.cut : undefined,
				}
				readFile(this.state.demoFile).then(data => {
					return edit(data, options);
				}).then(result => {
					console.log("done");
					this.setState({loading: false});
					downloadBuffer(result, this.state.demoName.replace('.dem', '_edited.dem'));
				}, err => {
					this.setState({loading: false, error: `Error while processing demo`});
					console.error("Error while editing demo");
					throw err;
				})
			} catch (e) {
				this.setState({error: `Error: ${e.message}`});
			}
		}
	}

	render() {
		let demoInfo: any[] | Element = [];
		if (this.state.demoInfo) {
			demoInfo = (
				<div className="demo-info">
					{this.state.demoInfo.map}
					<Duration className="time"
							  duration={Math.floor(this.state.demoInfo.duration)}/>
				</div>
			);
		}
		const dropText = this.state.error ? this.state.error : (this.state.loading ? 'Processing...' : (this.state.demoName ? this.state.demoName : 'Drop a file or click to start editing'));
		const enableControls = (this.state.demoInfo !== null);
		return (
			<div className='edit-page'>
				<p className="page-note">
					To edit a demo, select a file on your computer, select the desired options and press the "edit" button.
				</p>
				<section key="demo" className="demo">
					<DemoDropZone onDrop={this.onDrop.bind(this)}
								  text={dropText}/>
					{demoInfo}
				</section>
				{enableControls ? [
					<Section title="Unlock camera">
						<ul key={1}>
							<li key={1}>Unlocks the camera in pov demos, allowing free movement as if it were an stv demo.</li>
							<li key={2}>When the player respawns the camera will be moved.</li>
							<li key={3}>As pov demos only contain data near the player, far away players might freeze, teleport or otherwise behave weirdly.</li>
						</ul>
						<p key={2}>
							<input type="checkbox" id="pov-unlock" disabled={!enableControls}
								   checked={this.state.unlockPov}
								   onChange={() => {
									   this.setState({unlockPov: !this.state.unlockPov})
								   }}/>
							<label htmlFor="pov-unlock">Unlock camara for pov demo</label>
						</p>
					</Section>,
					<Section title="Cut demo">
						<ul key={1}>
							<li key={1}>Cuts the demo file to the selected tick range.</li>
							<li key={2}>Cutting demos is experimental, resulting demo files might crash, have broken animations or have other issues.</li>
							<li key={3}>Changing the specific cut range can sometimes work around issues with broken demos.</li>
						</ul>
						<p key={2}>
							<MultiRangeSlider
								min={0}
								max={this.state.demoInfo ? this.state.demoInfo.ticks : 0}
								onChange={(min, max) => {
									if (min !== this.state.cut.from || max !== this.state.cut.to) {
										this.setState({cut: {from: min, to: max}})
									}
								}}
								labelFn={(ticks) => formatDuration(ticks * this.state.intervalPerTick)}
							/>
						</p>
					</Section>,
					<Section title="Process">
						<p key={1}>
							<button onClick={this.edit.bind(this)}
									className="pure-button pure-button-primary"
									disabled={this.state.loading}>
								{this.state.loading ? 'Processing...' : 'Edit'}
							</button>
						</p>
					</Section>
				] : []}
				<Footer/>
			</div>
		);
	}
}
