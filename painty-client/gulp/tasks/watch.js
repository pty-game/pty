var gulp = require('gulp');
var configs = require('../config').watch;

gulp.task('watch', ['build'], function() {
  configs.forEach(function(config) {
    gulp.watch(config.src, config.tasks)
  })
});
