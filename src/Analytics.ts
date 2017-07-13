let lastPath = false;

export function registerPath(path) {
	if (path !== lastPath) {
		lastPath = path;
		if (typeof ga !== 'undefined') {
			ga('set', 'page', path);
			ga('send', 'pageview');
		}
	}
}
