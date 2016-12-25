'use strict';

import React, {Component} from 'react';
import {fuzzyTime} from '../FuzzyTime';
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
			<tr key={this.props.i} className={((this.props.i % 2 === 0) ? ' even': ' odd')}>
				<td className="title">
					<Link to={'/' + this.props.id}>
						{this.props.server} - {this.props.red}
						&nbsp;vs&nbsp;{this.props.blue}
					</Link>
				</td>
				<td className="format">{formatName}</td>
				<td className="map">{this.props.map}</td>
				<td className="duration"><Duration
					duration={this.props.duration}/></td>
				<td className="date">
					{fuzzyTime(this.props.time)}
				</td>
			</tr>
		);
	}

}
