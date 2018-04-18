'use strict';

import * as React from 'react';
import {Link} from 'react-router-dom';
import {LoginButton} from './LoginButton';
import {config} from '../config';

import './Header.css';
import {AuthProvider, User} from "../Providers/AuthProvider";
import EventHandler = React.EventHandler;
import MouseEvent = React.MouseEvent;

export interface HeaderProps {
	auth: AuthProvider;
	user: User | null;
	logoutHandler?: EventHandler<MouseEvent<HTMLAnchorElement>>;
}

export function Header(props: HeaderProps) {
	const login = props.auth.login.bind(props.auth);
	const rightMenu = (props.user && props.user.steamid && props.logoutHandler) ?
		[
			<span className="right" key="logout">
					<a onClick={props.logoutHandler}>Logout</a>
				</span>,
			(config.showUpload ? <span className="right upload" key="upload">
					<Link to='/upload'>Upload</Link>
				</span> : ''),
			<span className="right" key="user">
					<Link to={"/profiles/" + props.user.steamid}>
						{props.user.name}
					</Link>
			</span>
		] : [
			<span className="right" key="login">
					<LoginButton loginHandler={login}/>
				</span>
		];

	return (
		<header>
			<span key="main" className="main">
				<Link to="/">{config.title.toLocaleUpperCase()}</Link>
			</span>
			<span key="about">
				<Link className="pure-menu-link link-about"
					  to="/about">ABOUT</Link>
			</span>
			<span key="analyse">
				<Link className="pure-menu-link link-analyse"
					  to="/viewer">VIEWER</Link>
			</span>

			{rightMenu}
		</header>
	);
}
