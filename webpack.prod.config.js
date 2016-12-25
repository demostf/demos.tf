'use strict';

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[hash].css');
const CleanPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry  : {
		app: [
			'./src/index.js'
		],
	},
	output : {
		path         : path.join(__dirname, "build"),
		filename     : "[hash].js",
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	plugins: [
		new CleanPlugin(),
		extractCSS,
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.DefinePlugin({
			'process.env': {
				// Useful to reduce the size of client-side libraries, e.g. react
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new HtmlWebpackPlugin({
			title: 'demos.tf'
		}),
		new SWPrecacheWebpackPlugin(
			{
				cacheId                  : 'demos-tf',
				filename                 : 'service-worker.js',
				dontCacheBustUrlsMatching: [
					/\.(js|css)$/, // I'm cache busting js and css files myself
				]
			}
		)
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
				loaders: ['babel'],
				include: path.join(__dirname, 'src')
			},
			{
				test  : /\.css$/,
				loader: extractCSS.extract('style', 'css!postcss-loader')
			}
		]
	},
};
