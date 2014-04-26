var gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    jison      = require('gulp-jison');

const DIST_PATH    = './dist';
const SRC_PATH     = './src';
const GRAMMAR_FILE = SRC_PATH + '/grammar.jison';
const ENTRY_FILE   = SRC_PATH + '/dims.js'

gulp.task('parser', function() {
  return gulp.src(GRAMMAR_FILE)
    .pipe(jison())
    .pipe(rename('parser.js'))
    .pipe(gulp.dest(SRC_PATH));
});

gulp.task('browser', ['parser'], function() {
  return gulp.src(ENTRY_FILE)
    .pipe(browserify({
      detectGlobals: false,
      standalone: 'dims'
    }))
    .pipe(gulp.dest(DIST_PATH + '/browser'));
});

gulp.task('default', ['parser']);
