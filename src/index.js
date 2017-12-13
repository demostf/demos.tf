import React from 'react';
import ReactDom from 'react-dom';
import {App} from './App';

if (process.env.NODE_ENV !== 'production') {
	window.React = React;
}

const root = document.getElementById('react-root');

ReactDom.render((
	<App/>
), root);

if (process.env.NODE_ENV !== 'production' && module.hot) {
	const {AppContainer} = require('react-hot-loader');

	module.hot.accept('./App', () => {
		const RootContainer = require('./App').App;
		ReactDom.render(
			<AppContainer>
				<RootContainer/>
			</AppContainer>,
			root
		);
	});
}

if (navigator && `serviceWorker` in navigator && location.protocol === 'https:') {
	navigator.serviceWorker.register(`/service-worker.js`);
}
