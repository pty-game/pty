var gulp = require('gulp');
var del = require('del');
var config = require('../config.js').del;

gulp.task('del', function() {
  del(config.src)
});
