import React, {Component, cloneElement, ReactElement, StatelessComponent} from 'react';
import {Route, BrowserRouter} from "react-router-dom";
import Loadable from 'react-loadable';

import {Header} from './Components/Header';

import {ListPage} from './Pages/ListPage';

import {AuthProvider, User} from './Providers/AuthProvider';
import {DemoProvider, DemoListProvider} from './Providers/DemoProvider';

import './App.css';
import {Switch} from 'react-router';

export function Loading(props) {
	if (props.error) {
		console.error(props.error);
		return <div>Error!</div>;
	} else if (props.pastDelay) {
		return <div>Loading...</div>;
	} else {
		return null;
	}
}

export interface AppState {
	user: User | null;
}

export class App extends Component<{}, AppState> {
	auth = AuthProvider.instance;
	demoProvider = DemoProvider.instance;
	demoListProvider = DemoListProvider.instance;

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
		return (
			<div id="pagecontainer">
				<div className={`page`}>
					<BrowserRouter>
						<div>
							<Header user={this.state.user}
									auth={this.auth}
									logoutHandler={this.logoutHandler}/>
							<Switch>
								<Route path='/upload' component={LoadableUploadPage}/>
								<Route path='/profiles/:steamid' component={ListPage}/>
								<Route path='/uploads/:steamid' component={ListPage}/>
								<Route path='/about' component={LoadableAboutPage}/>
								<Route path='/api' component={LoadableApiPage}/>
								<Route path='/viewer/:id' component={LoadableAnalysePage}/>
								<Route path='/viewer' component={LoadableAnalysePage}/>
								<Route path='/:id' component={LoadableDemoPage}/>
								<Route path='/' component={ListPage}/>
							</Switch>
						</div>
					</BrowserRouter>
				</div>
			</div>
		);
	}
}

const getDemoComponent = () => import('./Pages/DemoPage').then(module => module.DemoPage);
const getApiComponent = () => import('./Pages/APIPage').then(module => module.APIPage);
const getAboutComponent = () => import('./Pages/AboutPage').then(module => module.AboutPage);
const getUploadComponent = () => import('./Pages/UploadPage').then(module => module.UploadPage);
const getAnalyseComponent = () => import('./Pages/AnalysePage').then(module => module.AnalysePage);

const getLoadable = (loader) => {
	return Loadable({
		loader,
		loading: Loading,
		delay: 200
	});
};

const LoadableDemoPage = getLoadable(getDemoComponent);
const LoadableApiPage = getLoadable(getApiComponent);
const LoadableAboutPage = getLoadable(getAboutComponent);
const LoadableUploadPage = getLoadable(getUploadComponent);
const LoadableAnalysePage = getLoadable(getAnalyseComponent);

