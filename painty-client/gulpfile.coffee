gulp = require 'gulp'

$ = require('gulp-load-plugins')()
del = require 'del'
source = require 'vinyl-source-stream'
browserify = require 'browserify'
runSequence = require 'run-sequence'
bower = require 'gulp-concat-vendor'

gulp.task 'clean:dev', ->
  del [
    '../painty-rest/assets/*',
    '!../painty-rest/assets/dependencies'
  ], force: true

gulp.task 'clean:dist', ->
  del [
    '../painty-rest/assets/*',
    '!../painty-rest/assets/dependencies'
  ], force: true

gulp.task 'scripts:dev', ->
  base = 'dist'

  filePath = './app/scripts/app.js'
  extensions = ['.js', '.jsx']

  browserify
    entries: [filePath]
    extensions: extensions
    debug: true
  .transform 'reactify'
  .bundle()
  .pipe source 'app.js'
  .pipe gulp.dest base + '/scripts'

  gulp.src('app/vendor/*').pipe(bower('vendor.js')).pipe gulp.dest(base + '/scripts')


gulp.task 'scripts:dist', ->
  base = 'build'

  filePath = './app/scripts/app.js'
  extensions = ['.jsx', '.js']

  browserify
    entries: [filePath]
    extensions: extensions
    debug: true
  .transform 'reactify'
  .bundle()
  .pipe source 'app.js'
  .pipe $.streamify($.uglify())
  .pipe gulp.dest base + '/scripts'


  gulp.src('app/vendor/*')
  .pipe bower('vendor.js')
  .pipe $.uglify()
  .pipe gulp.dest(base + '/scripts')


gulp.task 'compass:dev', ->
  base = 'dist'

  return gulp.src 'app/styles/main.sass'
  .pipe $.compass
    css: base + '/styles'
    sass: 'app/styles'
  .pipe $.autoprefixer
    browsers: ['last 5 versions']
  .pipe gulp.dest base + '/styles'

gulp.task 'compass:dist', ->
  base = 'build'

  return gulp.src 'app/styles/main.sass'
  .pipe $.compass
    css: base + '/styles'
    sass: 'app/styles'
  .pipe $.autoprefixer
    browsers: ['last 5 versions']
  .pipe $.minifyCss()
  .pipe gulp.dest base + '/styles'


gulp.task 'imagemin:dev', ->
  base = 'dist'

  return gulp.src 'app/images/*'
  .pipe $.imagemin
    progressive: true
    svgoPlugins: [removeViewBox: false]
  .pipe gulp.dest base + '/images'

gulp.task 'imagemin:dist', ->
  base = 'build'

  return gulp.src 'app/images/*'
  .pipe $.imagemin
    progressive: true
    svgoPlugins: [removeViewBox: false]
  .pipe gulp.dest base + '/images'


gulp.task 'copy:dev', ->
  base = 'dist'

  return gulp.src ['app/*.txt', 'app/*.ico', 'app/*.html']
  .pipe gulp.dest base

gulp.task 'copy:dist', ->
  base = 'build'

  return gulp.src ['app/*.txt', 'app/*.ico', 'app/*.html']
  .pipe gulp.dest base

gulp.task 'webserver', ->
  webserver = gulp.src ['dist']
  .pipe $.webserver
    host: '0.0.0.0' #change to 'localhost' to disable outside connections
    livereload:
      enable: true
    open: false

gulp.task 'serve', ->
  runSequence 'clean:dev', ['scripts:dev', 'compass:dev', 'copy:dev', 'webserver']
  gulp.watch 'app/*.html'
  gulp.watch 'app/scripts/**/*.js', ['scripts:dev']
  gulp.watch 'app/scripts/**/*.jsx', ['scripts:dev']
  gulp.watch 'app/styles/**/*.sass', ['compass:dev']

gulp.task 'build', ->
  runSequence ['clean:dist'],
    ['scripts:dist', 'compass:dist', 'imagemin:dist'],
    ['copy:dist']

gulp.task 'default', ['build']
