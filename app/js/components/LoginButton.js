import {Component} from 'react';

export class LoginButton extends Component {

	shouldComponentUpdate (nextProps, nextState) {
		return false;
	}

	click = (e) => {
		e.preventDefault();
		this.props.loginHandler();
	};

	render () {
		return (
			<a className="pure-menu-link steam-login"
			   onClick={this.click}>
				Sign in through Steam
			</a>
		);
	}

}
