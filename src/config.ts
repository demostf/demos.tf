export interface Config {
	title: string,
	gameTypes: { [key: string]: string },
	showDonate: boolean,
	showUpload: boolean,
	api: string
}

export const config: Config = {
	title: "everythingFPS",
	gameTypes: {
		'1v1': '1v1',
		'2v2': '2v2',
		'3v3': '3v3',
		'4v4': '4v4',
	},
	showDonate: false,
	showUpload: false,
	api: 'https://api.hl2dm.demos.tf/'
};
