export interface Config {
	title: string,
	gameTypes: { [key: string]: string },
	showDonate: boolean,
	showUpload: boolean,
	api: string
}

export const config: Config = {
	title: "demos.tf",
	gameTypes: {
		'4v4': '4v4',
		'6v6': '6v6',
		'hl': 'Highlander'
	},
	showDonate: true,
	showUpload: true,
	api: `https://api.${window.location.host}/`
};
