var gulp    = require('gulp');
var concat = require('gulp-concat');
var uglify  = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');

gulp.task('scripts', function() {
  gulp.src(['./**/*.js', '!./gulpfile.js', '!./app.min.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('./app.min.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gulp.dest('../public/js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('../public/js'));
});

gulp.task('minify', function() {
  return gulp.src(['./**/*.html', './**/**/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('../public'));
});

gulp.task('client', ['scripts', 'minify']);