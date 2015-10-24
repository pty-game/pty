var gulp = require('gulp');
var bower = require('gulp-concat-vendor');
var connect = require('gulp-connect');
var config = require('../config.js').vendors;

gulp.task('vendors', function() {
  gulp.src(config.src)
    .pipe(bower('vendor.js'))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
});
