var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test_assets', function() {
  var error = false;
  gulp.
    src('./test/assetTestScript.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed!');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests succeeded!');
        process.exit(0);
      }
    });
});

gulp.task('test', ['test_assets']);

gulp.task('watch', function() {
  gulp.watch(['./test/assetTestScript.js'], ['test']);
});