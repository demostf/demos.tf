'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';

export class TeamBanner extends Component {
	render () {
		return (
			<div className="teams">
				<div className="red">
					<span className="name">
						{this.props.redName}
					</span>
					<span className="score">{this.props.redScore}</span>
				</div>
				<div className="blue">
					<span className="score">{this.props.blueScore}</span>
					<span className="name">
						{this.props.blueName}
					</span>
				</div>
				<div className="clearfix"/>
			</div>
		);
	}
}
