export class BaseProvider {
	base = BaseProvider.getBaseUrl();

	static getBaseUrl() {
		// return 'https://api.demos.tf/';
		return `${window.location.protocol}//api.${window.location.host}/`;
	}

	getApiUrl(url) {
		return this.base + url;
	}

	request(url, params = {}, json = true): Promise<string | any> {
		return fetch(this.getApiUrl(url) + '?' + BaseProvider.formatParams(params))
			.then((response) => {
				if (json) {
					return response.json()
				} else {
					return response.text();
				}
			});
	}

	formatResponse(data) {
		data.time = new Date(data.time * 1000);
		return data;
	}

	static formatParams(params) {
		return Object.keys(params)
			.filter(k => params[k])
			.map(k => {
				if (params[k].push) {
					return params[k].map(v => encodeURIComponent(k) + "=" + encodeURIComponent(v)).join('&');
				} else {
					return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
				}
			})
			.join('&');
	}
}
