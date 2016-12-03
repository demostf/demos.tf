'use strict';

import {Component, cloneElement} from 'react';

import {Header} from './components/Header.js';
import {Footer} from './components/Footer.js';

import {ListPage} from './pages/ListPage.js';

import {AuthProvider} from './Providers/AuthProvider.js';
import {DemoProvider, DemoListProvider} from './Providers/DemoProvider.js';

export class App extends Component {
	state = {
		user: {
			token: null,
			name: null,
			steamid: null,
			key: null
		}
	};

	constructor () {
		super();
		this.auth = new AuthProvider();
		this.demoProvider = new DemoProvider();
		this.demoListProvider = new DemoListProvider();
	}

	componentDidMount = async()=> {
		var user = await this.auth.getUser();
		this.setState({user});
	};

	logoutHandler = async()=> {
		await this.auth.logout();
		this.componentDidMount();
	};

	render () {
		var children = this.props.children;
		if (!children) {
			children = <ListPage/>
		}
		children = React.cloneElement(children, {
			user: this.state.user,
			demoProvider: this.demoProvider,
			demoListProvider: this.demoListProvider
		});

		var page = children.type.page;
		return (
			<div id="pagecontainer">
				<div className={`page ${page}-page`}>
					<Header user={this.state.user} auth={this.auth}
							logoutHandler={this.logoutHandler}/>
					{children}
				</div>
			</div>
		);
	}
}
