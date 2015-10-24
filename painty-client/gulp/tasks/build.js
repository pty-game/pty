var gulp = require('gulp');
var connect = require('gulp-connect');
var config = require('../config').watch;

gulp.task('build', ['del', 'browserify', 'vendors', 'styles', 'copy']);
