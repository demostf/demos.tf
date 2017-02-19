'use strict';

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: {
		app: [
			// 'webpack-dev-server/client?http://localhost:3000',
			// 'webpack/hot/only-dev-server',
			'react-hot-loader/patch',
			'./src/index.js'
		]
	},
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name]-[hash].js",
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
		// alias: {
		// 	'react': 'preact-compat',
		// 	'react-dom': 'preact-compat'
		// }
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'demos.tf',
			chunks: ['app'],
			inlineSource: '\.css$',
			template: '!!html-loader!src/index.html'
		}),
		new webpack.NamedModulesPlugin()
	],
	module: {
		rules: [
			{test: /\.tsx?$/, use: ['react-hot-loader/webpack', 'ts-loader']},
			{
				test: /.*\.(gif|png|jpe?g|svg|webp)(\?.+)?$/i,
				use: [
					'url-loader?limit=5000&hash=sha512&digest=hex&name=[hash].[ext]'
				]
			},
			{
				test: /\.js$/,
				use: ['react-hot-loader/webpack', 'babel-loader'],
				include: path.join(__dirname, 'src')
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
