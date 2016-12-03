'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import {App} from './App.js';
import {DemoPage} from './pages/DemoPage';
import {ListPage} from './pages/ListPage';
import {UploadPage} from './pages/UploadPage.js';
import {AboutPage} from './pages/AboutPage.js';
import {APIPage} from './pages/APIPage.js';

if (process.env.NODE_ENV !== 'production') {
	// Enable React devtools
	window.React = React;
	// var whyDidYouUpdate = require('why-did-you-update');
	// whyDidYouUpdate.whyDidYouUpdate(React)
}

/**
 * Search bar - search for users by steamID/nickname, when go to this users profile, you can see his uploads and his played in demos
 Filter - possible to filter the demos on the frontpage by map, formatd P
 Add some styling - header, few other tabs so people can give you donations perhaps, about page. partners..
 * */

let lastPath = false;
let onEnter = (nextState) => {
	var path = nextState.location.pathname;
	if (path !== lastPath) {
		lastPath = path;
		if (window.ga) {
			window.ga('set', 'page', path);
			window.ga('send', 'pageview');
		}
	}
};

ReactDom.render((
	<Router history={browserHistory}>
		<Route component={App} path='/' onEnter={onEnter}>
			<Route path='/' component={ListPage} onEnter={onEnter}/>
			<Route path='/upload' component={UploadPage} onEnter={onEnter}/>
			<Route path='/profiles/:steamid' component={ListPage}
				   onEnter={onEnter}/>
			<Route path='/uploads/:steamid' component={ListPage}
				   onEnter={onEnter}/>
			<Route path='/about' component={AboutPage} onEnter={onEnter}/>
			<Route path='/api' component={APIPage} onEnter={onEnter}/>
			<Route path='/:id' component={DemoPage} onEnter={onEnter}/>
		</Route>
	</Router>
), document.getElementById('react'));
