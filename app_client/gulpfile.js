var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('browserify', function() {
  return gulp.
    src('./index.js').
    pipe(browserify()).
    pipe(gulp.dest('../public/bin'));
});

gulp.task('watch', function() {
  gulp.watch(['./*.js'], ['browserify']);
});
