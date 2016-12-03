'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var config = require('../config');
const imageminPngquant = require('imagemin-pngquant');

gulp.task('imagemin', function () {

	// Run imagemin task on all images
	return gulp.src(config.images.src)
		.pipe(gulpif(global.isProd, imagemin([imagemin.gifsicle(), imagemin.jpegtran(), imageminPngquant(), imagemin.svgo()])))
		.pipe(gulp.dest(config.images.dest))
		.pipe(gulpif(browserSync.active, browserSync.reload({
			stream: true,
			once: true
		})));

});
