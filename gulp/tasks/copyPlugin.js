'use strict';

var gulp = require('gulp');
var config = require('../config');

gulp.task('copyPlugin', function () {

	gulp.src(config.sourceDir + '../plugin/*').pipe(gulp.dest(config.buildDir + 'plugin/'));

});
