import request from 'superagent-bluebird-promise';

export class BaseProvider {
	base = BaseProvider.getBaseUrl();

	static getBaseUrl() {
		if (window.location.hostname.indexOf('platform.sh') !== -1) {
			return 'https://api---' + window.location.hostname + '/';
		} else if (window.location.hostname.indexOf('local.') !== -1) {
			return 'http://api.local.demos.tf/';
		}
		return 'https://api.demos.tf/';
	}

	getApiUrl (url) {
		return this.base + url;
	}

	request (url, params = {}) {
		return request.get(this.getApiUrl(url)).query(params).promise();
	}

	formatResponse (data) {
		data.time = new Date(data.time * 1000);
		return data;
	}
}
