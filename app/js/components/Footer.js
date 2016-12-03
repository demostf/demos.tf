import {Component} from 'react';

export class Footer extends Component {

	shouldComponentUpdate() {
		return false;
	}

	render () {
		return (
			<footer>
				<a href="https://steamcommunity.com/id/icewind1991">
					©icewind
				</a> 2016. Powered by Steam.
			</footer>
		);
	}

}
