'use strict';

const glob = require('glob');
const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: {
		app: [
			'./src/index.js'
		],
		polyfills: [
			`babel-polyfill`,
			`whatwg-fetch`,
		],
	},
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name]-[hash].js",
		libraryTarget: 'umd',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts']
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				imageWebpackLoader: {
					mozjpeg: {
						quality: 65
					},
					pngquant: {
						quality: "65-90",
						speed: 4
					},
					svgo: {
						plugins: [
							{
								removeViewBox: false
							}
						]
					}
				}
			},
			minimize: true,
			debug: false
		}),
		new CleanPlugin(['build']),
		new ExtractTextPlugin({
			filename: '[contenthash].css',
			allChunks: true
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				// Useful to reduce the size of client-side libraries, e.g. react
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new FaviconsWebpackPlugin({
			logo: './src/images/logo.png',
			title: 'demos.tf',
			background: '#444'
		}),
		new HtmlWebpackPlugin({
			title: 'demos.tf',
			chunks: ['app'],
			inlineSource: '\.css$',
			template: '!!html-loader!src/index.html'
		}),
		new HtmlWebpackInlineSourcePlugin(),
		new CompressionPlugin({
			algorithm: "zopfli",
			test: /\.js$|\.html$|\.css$/,
			threshold: 1024
		}),
		new SWPrecacheWebpackPlugin(
			{
				maximumFileSizeToCacheInBytes: 500000, // ~500kb
				cacheId: 'demos-tf',
				filename: 'service-worker.js',
				dontCacheBustUrlsMatching: [
					/^(?=.*\.\w{1,7}$)/, // I'm cache busting js and css files myself
				],
				verbose: false,
				logger: () => {
				},
				dynamicUrlToDependencies: {
					'/': [
						...glob.sync(`./src/**/*.js`),
						...glob.sync(`./src/**/*.css`),
						...glob.sync(`./src/**/*.svg`),
						...glob.sync(`./src/**/*.png`),
						`./src/index.html`
					]
				}
			}
		)
	],
	module: {
		rules: [
			{test: /\.tsx?$/, use: 'ts-loader'},
			{
				test: /.*\.(gif|png|jpe?g|svg|webp)(\?.+)?$/i,
				use: [
					'url-loader?limit=5000&hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack-loader'
				]
			},
			{
				test: /\.js$/,
				use: ['babel-loader'],
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ['css-loader', 'postcss-loader']
				})
			}
		]
	}
};
