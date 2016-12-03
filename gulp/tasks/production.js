'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', ['clean'], function (callback) {

	callback = callback || function () {
		};

	global.isProd = true;
	process.env.NODE_ENV = 'production';

	runSequence(['sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex', 'copyIcons', 'copyPlugin'], callback);

});
