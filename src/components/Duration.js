'use strict';

import React, {Component, PropTypes} from 'react';

function format (input) {
	if (!input) {
		return '-';
	}
	let hours = Math.floor(input / 3600);
	let minutes = Math.floor((input - (hours * 3600)) / 60);
	let seconds = input - (hours * 3600) - (minutes * 60);

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (hours !== '00') {
		return hours + ':' + minutes + ':' + seconds;
	} else {
		return minutes + ':' + seconds;
	}
}

export class Duration extends Component {
	shouldComponentUpdate (nextProps) {
		return nextProps.duration !== this.props.duration || nextProps.className !== this.props.className;
	}

	render () {
		const duration = format(this.props.duration);
		return (
			<span className={this.props.className||''}>{duration}</span>
		);
	}
}
