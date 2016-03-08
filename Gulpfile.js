const gulp = require('gulp');
const babel = require('gulp-babel');
const through2 = require('through2');
const watch = require('gulp-watch');
const rimraf = require('rimraf');

// for compilation
const source = './packages/*/src/**/*.js';
const dest = 'packages';
const srcEx = new RegExp("(packages/[^/]+)/src/");
const libFragment = "$1/lib/";

// for cleaning
const libs = './packages/**/lib';
const builds = './examples/**/build';

gulp.task('default', ['build']);

gulp.task('clean', function(cb) {
  rimraf.sync(libs);
  rimraf.sync(builds);
  cb();
});

gulp.task('build', function() {
  return gulp.src('./packages/*/src/**/*.js')
    .pipe(through2.obj(function(file, enc, callback) {
      file._path = file.path;
      file.path = file.path.replace(srcEx, libFragment);
      callback(null, file);
    }))
    .pipe(babel())
    .pipe(gulp.dest(dest));
});

gulp.task('watch', ['build'] ,function(callback) {
  watch(source, function() {
    gulp.start('build');
  });
});
