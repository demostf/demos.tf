'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var handleErrors = require('../util/handle-errors');
var config = require('../config');
var sassInlineImage = require('sass-inline-image');
var purify = require('gulp-purifycss');


gulp.task('sass', function () {

	return gulp.src(config.styles.src)
		.pipe(sass({
			sourceComments: global.isProd ? 'none' : 'map',
			sourceMap: 'sass',
			outputStyle: global.isProd ? 'compressed' : 'nested',
			functions: sassInlineImage({
				base: __dirname + '/../../app'
			})
		}))
		.on('error', handleErrors)
		.pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
		.on('error', handleErrors)
		.pipe(gulp.dest(config.styles.dest))
		.pipe(gulpif(browserSync.active, browserSync.reload({stream: true})));

});
