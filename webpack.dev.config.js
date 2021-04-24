'use strict';

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'eval-cheap-source-map',
	mode: 'development',
	entry: {
		app: [
			'./src/index.tsx'
		]
	},
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name]-[contenthash].js",
		libraryTarget: 'umd',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts']
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'demos.tf',
			chunks: ['app'],
			inlineSource: '\.css$',
			template: '!!html-loader!src/index.html'
		})
	],
	module: {
		rules: [
			{test: /\.tsx?$/, use: ['ts-loader']},
			{
				test: /.*\.(gif|png|jpe?g|svg|webp)(\?.+)?$/i,
				use: [
					'url-loader?limit=5000&hash=sha512&digest=hex&name=[hash].[ext]'
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader']
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, './src')
	},
};
