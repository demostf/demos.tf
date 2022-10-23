import * as React from 'react';

export function formatDuration(input) {
	if (!input) {
		return '0:00';
	}
	const hours = Math.floor(input / 3600);
	const minutes = Math.floor((input - (hours * 3600)) / 60);
	const seconds = Math.floor(input - (hours * 3600) - (minutes * 60));

	const hourString = (hours < 10) ? "0" + hours : "" + hours;
	const minuteString = (minutes < 10) ? "0" + minutes : "" + minutes;
	const secondString = (seconds < 10) ? "0" + seconds : "" + seconds;

	if (hourString !== '00') {
		return hourString + ':' + minuteString + ':' + secondString;
	} else {
		return minuteString + ':' + secondString;
	}
}

export interface DurationProps {
	duration: number;
	className?: string;
}

export function Duration(props: DurationProps) {
	const duration = formatDuration(props.duration);
	return (
		<span className={props.className||''}>{duration}</span>
	);
}
