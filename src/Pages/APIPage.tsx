import * as React from 'react';

import {Section} from '../Components/Section';

import './APIPage.css';
import {AuthProvider, User} from "../Providers/AuthProvider";
import {config} from '../config';

export interface APIPageProps {
	user: User | null;
}

export default class APIPage extends React.Component<APIPageProps, {}> {
	static page = 'api';

	componentDidMount() {
		document.title = "API - demos.tf"
	}

	render() {
		const steamId = (AuthProvider.instance.user && AuthProvider.instance.user.steamid) ? AuthProvider.instance.user.steamid : '76561198024494988';
		const listItem = {
			id: 3314,
			url: "https://demostf.blob.core.windows.net/demos/55be20b7adb21stvdemos220466v6-2015-08-02-15-21-bluvsred-cpgullywashfinal1.dem",
			name: "stvdemos/22046_6v6-2015-08-02-15-21-blu_vs_red-cp_gullywash_final1.dem",
			server: "TF2Pickup.net | #4.NL | 6v6 | Powered by SimRai.com",
			duration: 1809,
			nick: "SourceTV Demo",
			map: "cp_gullywash_final1",
			time: 1438523578,
			red: "RED",
			blue: "BLU",
			redScore: 1,
			blueScore: 5,
			playerCount: 12,
			uploader: 2565
		};
		const demoInfo = {
			id: 314,
			url: "https://demostf.blob.core.windows.net/demos/5510b8e522f7cmatch-20150323-1937-cpprocessfinal.dem",
			name: "match-20150323-1937-cp_process_final.dem",
			server: "UGC 6v6 Match",
			duration: 1809,
			nick: "SourceTV Demo",
			map: "cp_process_final",
			time: 1427159270,
			red: "TITS!",
			blue: "BLU",
			redScore: 3,
			blueScore: 1,
			playerCount: 12,
			uploader: {
				id: 1052,
				steamid: "76561198028052915",
				name: "Reƒraction"
			},
			players: [
				{
					id: 4364,
					user_id: 1614,
					name: "dankest memes",
					team: "red",
					'class': "scout",
					steamid: "76561198070261020",
					avatar: "http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/4a/4a06c61bee548e1f8e81d5dcb2d3741f8ee30ac0_medium.jpg",
					kills: 10,
					assists: 0,
					deaths: 19
				}
			]
		};

		let listExample = JSON.stringify([listItem], null, 4);
		listExample = listExample.substr(0, listExample.length - 2) + ",\n    ...\n]";

		let demoExample = JSON.stringify(demoInfo, null, 4);
		demoExample = demoExample.substr(0, demoExample.length - 8) + ",\n        ...\n    ]\n}";
		demoExample = demoExample.replace('"__REPLACE__": ""', '...');

		return (
			<div className='api-page'>
				<Section title="API">
					<p>
						Demos.tf provides a REST api that allows 3rd parties
						to the demo information stored on the site which
						is located at.
					</p>
					<pre>https://api.demos.tf/</pre>
				</Section>

				<Section title="Listing Demos">
					<p>
						There are three api endpoints that can be used to
						retrieve a list of demos.
					</p>
					<ul>
						<li>
							<a href="https://api.demos.tf/demos/">/demos/</a>
							lists all demos
						</li>
						<li>
							<a href={"https://api.demos.tf/uploads/" + steamId}>/uploads/$steamid</a>
							lists demos uploaded by a user.
						</li>
						<li>
							<a href={"https://api.demos.tf/profiles/" + steamId}>/profiles/$steamid</a>
							lists demos in which a user played.
						</li>
					</ul>
					<p>
						Users are identified by their steamid in
						the <code>7656xxxxxxxxxxxxx</code> format.
					</p>
				</Section>

				<Section title="Filters">
					<p>
						Each of the three list end points accept the
						following filters to search for demos.
					</p>
					<ul>
						<li>
							<a href="https://api.demos.tf/demos/?map=cp_granary">map=xxxx</a>
							only show demos for a specific map.
						</li>
						<li>
							<a href="https://api.demos.tf/demos/?type=6v6">type=xxx</a>
							only show <code>4v4</code>, <code>6v6</code> or <code>hl</code> demos.
						</li>
						<li>
							<a href={"https://api.demos.tf/demos/?players[]=" + steamId}>players[]=xxxx</a>
							only show demos where a specific player has
							played.<br/>
							<ul>
								<li>
									Multiple player filters can be specified
									to find
									demos where all of the given players
									have
									played.
								</li>
								<li>
									Note that when using the <code>/profiles/$steamid</code> endpoint
									the user for the endpoint is
									added to the filter.
								</li>
							</ul>
						</li>
						<li>
							<a href="https://api.demos.tf/demos/?before=1454455622">before=xxx</a>
							only show demos uploaded before a certain time.
						</li>
						<li>
							<a href="https://api.demos.tf/demos/?after=1454455622">after=xxx</a>
							only show demos uploaded after a certain time.
						</li>
						<li>
							<a href="https://api.demos.tf/demos/?before_id=12345">before_id=xxx</a>
							only show demos with an id lower than the provided one.
						</li>
						<li>
							<a href="https://api.demos.tf/demos/?after_id=12345">after_id=xxx</a>
							only show demos with an id higher than the provided one.
						</li>
					</ul>
					<p>
						All filters should be provided as query parameter
						and can be combined in any combination.
					</p>
				</Section>
				<Section title="Sorting">
					<p>
						By default the demo listing will be sorted in descending order,
						meaning newer demos will be listed first, this can be changed
						by adding <a href="https://api.demos.tf/demos/?order=ASC">order=ASC</a>.
					</p>
				</Section>
				<Section title="Paging">
					<p>
						All the list endpoints limit the number of items
						returned and accept a <code>page</code> query
						parameter for retrieving larger number of results.
					</p>

					<p>
						As an alternative to using <code>page</code> to offset the results
						you can also use the <code>after_id</code> or <code>before_id</code>
						to manually paginate your queries.
					</p>
				</Section>
				<Section title="List response">
					<p>
						The response from a list endpoint consists of a list
						containing demo items in the following format.
					</p>

					<pre>{listExample}</pre>
					<ul>
						<li>
							<code>id</code> the unique id of the demo
						</li>
						<li>
							<code>url</code> the download url for the demo
							file
						</li>
						<li>
							<code>name</code> the filename of the demo file
						</li>
						<li>
							<code>server</code> the server name during the
							match
						</li>
						<li><code>duration</code> the length of the match in
							seconds
						</li>
						<li>
							<code>nick</code> the nickname of the user
							recording the demo
						</li>
						<li>
							<code>map</code> the map on which the match was
							played
						</li>
						<li>
							<code>time</code> the time when the demo was
							uploaded as unix timestamp
						</li>
						<li>
							<code>red</code> the name of the RED team during
							the match
						</li>
						<li>
							<code>blue</code> the name of the BLU team
							during the match
						</li>
						<li>
							<code>redScore</code> the number of points
							scored by the red team
						</li>
						<li>
							<code>blueScore</code> the number of points
							scored by the blue team
						</li>
						<li>
							<code>playerCount</code> the number of players
							in the match
						</li>
						<li>
							<code>uploader</code> the unique id of the user
							which uploaded the demo
						</li>
					</ul>
				</Section>
				<Section title="Demo info">
					<p>
						The full information of a demo can be found at <a
						href="https://api.demos.tf/demos/314">/demos/$id</a>
					</p>
				</Section>
				<Section title="Demo response">
					<p>
						The response from a demo endpoint is in the
						following format.
					</p>

					<pre>{demoExample}</pre>
					<p>
						The first 12 items are the same as the items in the
						list response.
					</p>
					<ul>
						<li>
							<code>uploader</code> information about the user
							who uploaded the demo
							<ul>
								<li>
									<code>id</code> the unique id for the
									user
								</li>
								<li>
									<code>steamid</code> the steamid for the
									user
								</li>
								<li>
									<code>name</code> the name of the
									uploader
								</li>
							</ul>
						</li>
						<li>
							<code>players</code> the information about the
							players of the match
							<ul>
								<li>
									<code>id</code> the unique id for user
									in this id
								</li>
								<li>
									<code>user_id</code> the unique id for
									the
									user
								</li>
								<li>
									<code>name</code> the name of the player
									during the match
								</li>
								<li>
									<code>class</code> the class the player
									played during the match
								</li>
								<li>
									<code>steamid</code> the steamid of the
									user
								</li>
								<li>
									<code>avatar</code> the avatar for the
									user
								</li>
								<li>
									<code>kills</code> the number of kills
									made by the player during the match
								</li>
								<li>
									<code>assists</code> the number of
									assists
									made by the player during the match
								</li>
								<li>
									<code>deaths</code> the number of deaths
									during the game
								</li>
							</ul>
						</li>
					</ul>
				</Section>

				{config.showUpload ? <Section title="Uploading Demos">
					<p>
						Demos can be uploaded by making a <code> POST </code>
						request to
						<code> https://api.demos.tf/upload </code> with the following
						fields set as form data.
					</p>
					<ul>
						<li>
							<code>key</code> the api key of the user uploading the demo
						</li>
						<li>
							<code>name</code> the name of the demo file
						</li>
						<li>
							<code>red</code> the name of the RED team
						</li>
						<li>
							<code>blu</code> the name of the BLU team
						</li>
						<li>
							<code>demo</code> the demo file to be uploaded, as form file upload
						</li>
					</ul>
				</Section> : []}

				<Section title="Database Dump">
					<p>
						If you're planning on analysing data from demos.tf, a public <a href="https://freezer.demos.tf/database/demostf.sql.gz">database dump</a> for PostgreSQL is available for download.
					</p>
				</Section>
			</div>
		);
	}
}
