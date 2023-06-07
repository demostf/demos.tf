'use strict';

const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
		filename: "[name]-[contenthash].js",
		libraryTarget: 'umd',
		publicPath: '/'
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts'],
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				imageWebpackLoader: {
					pngquant: {
						quality: "65-90",
						speed: 4
					},
					gifsicle: {
						enabled: false,
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
		}),
		new CopyPlugin ({
			patterns: [
				{
					from: 'node_modules/@demostf/parser-worker/dist/*.js',
					to: '',
					flatten: true,
				},
				{
					from: 'node_modules/@demostf/parser-worker/dist/*.wasm',
					to: '',
					flatten: true,
				},
				{
					from: 'node_modules/@demostf/edit/dist/*.js',
					to: '',
					flatten: true,
				},
				{
					from: 'node_modules/@demostf/edit/dist/*.wasm',
					to: '',
					flatten: true,
				}
			]
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
					'file-loader'
				],
				type: 'asset',
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
