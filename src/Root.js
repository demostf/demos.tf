'use strict';

import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import {App} from './App';
import {ListPage} from './Pages/ListPage';

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

const getDemoComponent = (nextState, callback) => {
	require.ensure([], function (require) {
		callback(null, require('./Pages/DemoPage').DemoPage)
	});
};

const getApiComponent = (nextState, callback) => {
	require.ensure([], function (require) {
		callback(null, require('./Pages/APIPage').APIPage)
	});
};

const getAboutComponent = (nextState, callback) => {
	require.ensure([], function (require) {
		callback(null, require('./Pages/AboutPage').AboutPage)
	});
};

const getUploadComponent = (nextState, callback) => {
	require.ensure([], function (require) {
		callback(null, require('./Pages/UploadPage').UploadPage)
	});
};

const getAnalyseComponent = (nextState, callback) => {
	require.ensure([], function (require) {
		callback(null, require('./Pages/AnalysePage').AnalysePage)
	});
};

export function Root () {
	return (
		<Router history={browserHistory}>
			<Route component={App} path='/' onEnter={onEnter}>
				<Route path='/' component={ListPage} onEnter={onEnter}/>
				<Route path='/upload' getComponents={getUploadComponent}
					   onEnter={onEnter}/>
				<Route path='/profiles/:steamid' component={ListPage}
					   onEnter={onEnter}/>
				<Route path='/uploads/:steamid' component={ListPage}
					   onEnter={onEnter}/>
				<Route path='/about' getComponents={getAboutComponent}
					   onEnter={onEnter}/>
				<Route path='/api' getComponents={getApiComponent}
					   onEnter={onEnter}/>
				<Route path='/viewer' getComponents={getAnalyseComponent}
					   onEnter={onEnter}/>
				<Route path='/viewer/:id' getComponents={getAnalyseComponent}
					   onEnter={onEnter}/>
				<Route path='/:id' getComponents={getDemoComponent}
					   onEnter={onEnter}/>
			</Route>
		</Router>
	);
}
