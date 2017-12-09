import React, {Component, cloneElement, ReactElement, ReactNode} from 'react';

import {Header} from './Components/Header';

import {ListPage} from './Pages/ListPage';

import {AuthProvider, User} from './Providers/AuthProvider';
import {DemoProvider, DemoListProvider} from './Providers/DemoProvider';

import './App.css';

export interface AppState {
	user: User | null;
}

export class App extends Component<{}, AppState> {
	auth = new AuthProvider();
	demoProvider = new DemoProvider();
	demoListProvider = new DemoListProvider();

	state: AppState = {
		user: null
	};

	async componentDidMount() {
		const user = await this.auth.getUser();
		this.setState({user});
	}

	logoutHandler = async () => {
		await this.auth.logout();
		this.componentDidMount();
	};

	render() {
		let children;
		if (this.props.children) {
			children = cloneElement(this.props.children as ReactElement<any>, {
				user: this.state.user,
				demoProvider: this.demoProvider,
				demoListProvider: this.demoListProvider
			});
		} else {
			children = <ListPage demoListProvider={this.demoListProvider} route={{path: '/'}} params={{}}/>
		}

		const page = children.type.page;
		return (
			<div id="pagecontainer">
				<div className={`page ${page}-page`}>
					<Header user={this.state.user}
							auth={this.auth}
							logoutHandler={this.logoutHandler}/>
					{children}
				</div>
			</div>
		);
	}
}
