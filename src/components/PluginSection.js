import React, {Component} from 'react';
import {Section} from '../components/Section.js';

export class PluginSection extends Component {

	render () {
		var keyStep = '';
		if (!this.props.user.key) {
			keyStep = (
				<li>
					Login to retrieve your api-key
				</li>
			);
		}

		return (
			<Section title="Plugin">
				<p>The demos.tf server plugin automatically uploads any
					stv demo recorded on the server and makes it
					available
					for download.</p>

				<p>Note that the plugin does <u>not</u> automaticaly
					record demos on it's own
					but relies on other plugins like <a
						href="http://teamfortress.tv/thread/13598/?page=1#post-1">F2's
						RecordSTV</a> to manage the recording of stv
					demos</p>
				<h5>How to install</h5>
				<ol>
					<li>Make sure <a
						href="http://wiki.alliedmods.net/Installing_SourceMod">SourceMod</a>
						is
						installed on
						your server.
					</li>
					<li>Make sure the <a
						href="https://code.google.com/p/sourcemod-curl-extension/">
						cURL extension
					</a> is installed on your server.
					</li>
					<li>Download the plugin.</li>
					<li>Upload the .smx file to <code>/tf/addons/sourcemod/plugins/</code>
						on your server.
					</li>
					{keyStep}
					<li>Add the following code to
						<code>/tf/cfg/server.cfg</code>
						on the server:
						<pre>sm_demostf_apikey {this.props.user.key || '<<API KEY>>'}</pre>
					</li>
					<li>Restart the server</li>
				</ol>
				<a className="pure-button pure-button-primary"
				   href="https://github.com/demostf/plugin/raw/master/demostf.smx">Download</a>
				<a className="pure-button"
				   href="https://github.com/demostf/plugin/raw/master/demostf.sp">Source</a>
			</Section>
		);
	}

}
