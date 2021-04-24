'use strict';

const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	devtool: 'source-map',
	entry: {
		app: [
			'./src/index.tsx'
		],
		polyfills: [
			`whatwg-fetch`,
		],
	},
	mode: 'production',
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name]-[hash].js",
		libraryTarget: 'umd',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
		// alias: {
		// 	'react': 'preact-compat',
		// 	'react-dom': 'preact-compat',
		// 	'create-react-class': 'preact-compat/lib/create-react-class'
		// }
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				imageWebpackLoader: {
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
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[contenthash].css'
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
		new CompressionPlugin({
			test: /\.(js|css|html|svg)$/,
			threshold: 1024
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true
		})
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					silent: true
				}
			},
			{
				test: /.*\.(gif|png|jpe?g|svg|webp)(\?.+)?$/i,
				use: [
					'url-loader?limit=5000&hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			}
		]
	}
};
