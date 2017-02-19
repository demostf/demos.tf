import React, {Component, cloneElement} from 'react';

import {Header} from './Components/Header';
import {Footer} from './Components/Footer';

import {ListPage} from './Pages/ListPage';

import {AuthProvider} from './Providers/AuthProvider';
import {DemoProvider, DemoListProvider} from './Providers/DemoProvider';

import './App.css';

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

	componentDidMount = async () => {
		const user = await this.auth.getUser();
		this.setState({user});
	};

	logoutHandler = async () => {
		await this.auth.logout();
		this.componentDidMount();
	};

	render () {
		let children = this.props.children;
		if (!children) {
			children = <ListPage />
		}
		children = React.cloneElement(children, {
			user: this.state.user,
			demoProvider: this.demoProvider,
			demoListProvider: this.demoListProvider
		});

		const page = children.type.page;
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
