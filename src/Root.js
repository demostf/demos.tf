'use strict';

import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import {App} from './App';
import {DemoPage} from './pages/DemoPage';
import {ListPage} from './pages/ListPage';
import {UploadPage} from './pages/UploadPage';
import {AboutPage} from './pages/AboutPage';
import {APIPage} from './pages/APIPage';
import {AppContainer} from 'react-hot-loader';

let lastPath = false;
let onEnter = (nextState) => {
	const path = nextState.location.pathname;
	if (path !== lastPath) {
		lastPath = path;
		if (window.ga) {
			window.ga('set', 'page', path);
			window.ga('send', 'pageview');
		}
	}
};

export function Root() {
	return (
		<Router history={browserHistory}>
			<Route component={App} path='/' onEnter={onEnter}>
				<Route path='/' component={ListPage} onEnter={onEnter} />
				<Route path='/upload' component={UploadPage} onEnter={onEnter} />
				<Route path='/profiles/:steamid' component={ListPage}
					   onEnter={onEnter} />
				<Route path='/uploads/:steamid' component={ListPage}
					   onEnter={onEnter} />
				<Route path='/about' component={AboutPage} onEnter={onEnter} />
				<Route path='/api' component={APIPage} onEnter={onEnter} />
				<Route path='/:id' component={DemoPage} onEnter={onEnter} />
			</Route>
		</Router>
	);
}
