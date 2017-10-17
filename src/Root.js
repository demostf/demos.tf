'use strict';

import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import {App} from './App';
import {ListPage} from './Pages/ListPage';

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

export function Root() {
	return (
		<Router history={browserHistory}>
			<Route component={App} path='/'>
				<Route path='/' component={ListPage}/>
				<Route path='/upload' getComponents={getUploadComponent}/>
				<Route path='/profiles/:steamid' component={ListPage}/>
				<Route path='/uploads/:steamid' component={ListPage}/>
				<Route path='/about' getComponents={getAboutComponent}/>
				<Route path='/api' getComponents={getApiComponent}/>
				<Route path='/viewer' getComponents={getAnalyseComponent}/>
				<Route path='/viewer/:id' getComponents={getAnalyseComponent}/>
				<Route path='/:id' getComponents={getDemoComponent}/>
			</Route>
		</Router>
	);
}
