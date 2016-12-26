'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import {Root} from './Root';
import {AppContainer} from 'react-hot-loader';

require("babel-regenerator-runtime");

// To add to window
if (!window.Promise) {
	window.Promise = Promise;
}

if (process.env.NODE_ENV !== 'production') {
	window.React = React;
}

const root = document.getElementById('react-root');

ReactDom.render((
	<Root/>
), root);

if (module.hot) {
	module.hot.accept('./Root', () => {
		const RootContainer = require('./Root').Root;
		ReactDom.render(
			<AppContainer>
				<RootContainer />
			</AppContainer>,
			root
		);
	});
}

if (navigator && `serviceWorker` in navigator && location.protocol === 'https:') {
	navigator.serviceWorker.register(`/service-worker.js`);
}
