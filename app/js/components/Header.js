'use strict';

import {Component} from 'react';
import {Link} from 'react-router';
import {LoginButton} from '../components/LoginButton.js';

export class Header extends Component {

	render () {
		var login = this.props.auth.login.bind(this.props.auth);
		if (this.props.user && this.props.user.steamid) {
			var rightMenu = <ul className="pure-menu-list">
				<li className="pure-menu-item">
					<Link className="pure-menu-link"
						  to={"/profiles/" + this.props.user.steamid}>{this.props.user.name}</Link>
				</li>
				<li className="pure-menu-item">
					<Link className="pure-menu-link"
						  to='/upload'>Upload</Link>
				</li>
				<li className="pure-menu-item">
					<a className="pure-menu-link"
					   onClick={this.props.logoutHandler}>Logout</a>
				</li>
			</ul>;
		} else {
			rightMenu = <ul className="pure-menu-list">
				<li className="pure-menu-item">
					<LoginButton loginHandler={login}/>
				</li>
			</ul>;
		}

		return (
			<header
				className="home-menu pure-menu pure-menu-open pure-menu-horizontal pure-menu-fixed">
				<span className="pure-menu-heading">
					<Link className="pure-menu-link link-home" to="/">DEMOS.TF</Link>
				</span>
				<span className="pure-menu-heading">
					<Link className="pure-menu-link link-about"
						  to="/about">About</Link>
				</span>
				{rightMenu}

			</header>
		);
	}
}
