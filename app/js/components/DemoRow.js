'use strict';

import {Component} from 'react';
import Timestamp from 'react-time';
import {Duration} from './Duration.js'
import {Link} from 'react-router';

export class DemoRow extends Component {
	shouldComponentUpdate (nextProps) {
		return nextProps.id !== this.props.id;
	}

	render () {
		var formatName = 'Other';
		if (this.props.playerCount <= 19 && this.props.playerCount >= 17) {
			formatName = 'HL';
		} else if (this.props.playerCount <= 13 && this.props.playerCount >= 11) {
			formatName = '6v6';
		} else if (this.props.playerCount <= 9 && this.props.playerCount >= 7) {
			formatName = '4v4';
		}
		return (
			<div className={"row" + ((this.props.i % 2 === 0) ? ' even': ' odd')}>
				<div className="title">
					<Link to={'/' + this.props.id}>
						{this.props.server} - {this.props.red}
						&nbsp;vs&nbsp;{this.props.blue}
					</Link>
				</div>
				<div className="format">{formatName}</div>
				<div className="map">{this.props.map}</div>
				<div className="duration"><Duration
					duration={this.props.duration}/></div>
				<div className="date"><Timestamp value={this.props.time}
												 relative/>
				</div>
			</div>
		);
	}

}
