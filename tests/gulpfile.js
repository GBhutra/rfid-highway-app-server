var gulp = require('gulp');
var mocha = require('gulp-mocha');
var runSequesce = require('run-sequence').use(gulp);

gulp.task('test_asset_model', function() {
  var error = false;
  gulp.
    src('./test_app/testAssetModel.js').
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

gulp.task('test_user_model', function() {
  var error = false;
  gulp.
    src('./test_app/testUserModel.js').
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

gulp.task('test_asset_api', function() {
  var error = false;
  gulp.
    src('./test_app/testAssetAPI.js').
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

gulp.task('test_auth_api', function() {
  var error = false;
  gulp.
    src('./test_app/testAuthenticationAPI.js').
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

gulp.task('test_app', function()  {
   runSequesce('test_asset_model','test_user_model','test_asset_api');
});

gulp.task('watch', function() {
  gulp.watch(['./test_app/*.js'], ['test_app']);
});