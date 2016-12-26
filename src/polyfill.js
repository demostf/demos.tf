(function () {
	var newBrowser = (
		window['fetch'] &&
		window['Promise'] &&
		Object['assign'] &&
		Object['keys']
	);

	if (!newBrowser) {
		console.log('You need polyfills to do a job. Shame.');
		var scripts = document.getElementsByTagName('script');
		var hash = '';
		var firstScript;
		for (var i = 0; i < scripts.length; i++) {
			var matches = document.scripts[i].textContent.match('=polyfillLoader-([a-z0-9]+).js');
			if (matches) {
				hash = matches[1];
				firstScript = scripts[i];
			}
		}
		window.foo='test';

		var scriptEl = document.createElement('script');
		scriptEl.src = '/polyfills-' + hash + '.js';
		scriptEl.async = false;
		firstScript.parentNode.insertBefore(scriptEl, firstScript);
	}
})();
