'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import {LoginButton} from '../components/LoginButton.js';

require('./Header.css');

export class Header extends Component {

	render() {
		const login = this.props.auth.login.bind(this.props.auth);
		let rightMenu;
		if (this.props.user && this.props.user.steamid) {
			rightMenu = [
				<span className="right" key="logout">
					<a onClick={this.props.logoutHandler}>Logout</a>
				</span>,
				<span className="right upload" key="upload">
					<Link to='/upload'>Upload</Link>
				</span>,
				<span className="right" key="user">
					<Link to={"/profiles/" + this.props.user.steamid}>{this.props.user.name}</Link>
				</span>
			];
		} else {
			rightMenu = [
				<span className="right" key="login">
					<LoginButton loginHandler={login} />
				</span>
			];
		}

		return (
			<header>
				<span key="main" className="main">
					<Link to="/">DEMOS.TF</Link>
				</span>
				<span key="about">
					<Link className="pure-menu-link link-about"
						  to="/about">ABOUT</Link>
				</span>


				{rightMenu}
			</header>
		);
	}
}
