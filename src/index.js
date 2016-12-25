'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import {Root} from './Root';
import {AppContainer} from 'react-hot-loader';

if (process.env.NODE_ENV !== 'production') {
	window.React = React;
}

const body = document.getElementsByTagName('body')[0];
const root = document.createElement('div');
body.appendChild(root);

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

if (navigator && `serviceWorker` in navigator) {
	navigator.serviceWorker.register(`/service-worker.js`);
}
