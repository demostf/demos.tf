import * as React from 'react';

export function Loading(props) {
	if (props.error) {
		return <div>Error!</div>;
	} else if (props.pastDelay) {
		return <div>Loading...</div>;
	} else {
		return null;
	}
}
