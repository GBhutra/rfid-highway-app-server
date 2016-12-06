var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test_asset_model', function() {
  var error = false;
  gulp.
    src('./test/testAssetModel.js').
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

gulp.task('test', ['test_asset_model']);

gulp.task('watch', function() {
  gulp.watch(['./test/testAssetModel.js'], ['test']);
});