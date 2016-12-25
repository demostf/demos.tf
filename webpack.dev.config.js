'use strict';

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'eval',
	entry  : {
		app: [
			'webpack-dev-server/client?http://localhost:3000',
			'webpack/hot/only-dev-server',
			'react-hot-loader/patch',
			'./src/index.js'
		],
	},
	output : {
		path         : path.join(__dirname, "dist"),
		filename     : "[name].bundle.js",
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: 'demos.tf'
		})
	],
	module : {
		loaders: [
			{
				test   : /.*\.(gif|png|jpe?g|svg|webp)(\?.+)?$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]'
				]
			},
			{
				test   : /\.js$/,
				loaders: ['react-hot-loader/webpack', 'babel'],
				include: path.join(__dirname, 'src')
			},
			{
				test  : /\.css$/,
				loaders: ['style', 'css', 'postcss-loader?sourceMap=inline']
			}
		]
	},
};
