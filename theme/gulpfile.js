var gulp = require('gulp')
var sass = require('gulp-sass')
var jshint = require('gulp-jshint')
var stylish = require('jshint-stylish')
var scsslint = require('gulp-scss-lint')
var svg2png = require('gulp-svg2png')
var babel = require('gulp-babel')
var babelify = require('babelify')
var source = require('vinyl-source-stream');
var cssGlobbing = require('gulp-css-globbing')
var uglify = require('gulp-uglify')
var uglifycss = require('gulp-uglifycss')
var react = require('gulp-react')
var browserify = require('browserify')
var jquery = require('gulp-jquery');
var argv = require('minimist')(process.argv.slice(2))

// babel
gulp.task('babel', function () {
  return gulp.src('./js/src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./js/dist'))
})

// svg2png
gulp.task('svg2png', function () {
  gulp.src('./graphics/**/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./graphics'))
})

// Compile sass
gulp.task('sass', function () {
  return gulp.src('scss/main.scss')
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
})

gulp.task('css', function () {
  gulp.src('css/**/*.css')
    .pipe(uglifycss({
      max_line_len: 80
    }))
    .pipe(gulp.dest('./css/dist/'));
});

gulp.task('jquery', function () {
    return jquery.src({
        release: 2, //jQuery 2
        flags: ['-deprecated', '-event/alias', '-ajax/script', '-ajax/jsonp', '-exports/global']
    })
    .pipe(gulp.dest('./assets/'));
});

gulp.task('scss-lint', function () {
 return gulp.src(['scss/**/*.scss', '!scss/print.scss', '!scss/normalize.scss'])
   .pipe(scsslint({ 'config': '.scss-lint.yml'}))
})

// Jshint
gulp.task('jshint', function () {
  return gulp.src('./js/dist/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
})

gulp.task('build', function () {
  browserify({
    entries: './js/src/index.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./js/dist'));
});

// Watch .scss and .js
gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', ['sass', 'css'])

  if (argv.babel) {
    gulp.watch('./js/src/**/*.js', ['babel'])
  } else if (argv.react) {
    gulp.watch('./js/src/**/*.jsx', ['build'])
  }else {
    gulp.watch('./js/**/*.js', ['jshint'])
  }
})

// Set default task
gulp.task('default', ['watch'])
