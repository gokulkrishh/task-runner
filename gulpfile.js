'use strict';

var gulp 	  = require('gulp'),
	chalk 	  = require('chalk'),
	concat 	  = require('gulp-concat'),
	jshint 	  = require('gulp-jshint'),
	// minifycss = require('gulp-minify-css'),
	stylish   = require('jshint-stylish'),
	uglify    = require('gulp-uglify');


/**===========================================
  			JS Hint
=============================================*/

gulp.task('jshint', function() {
	console.log(chalk.yellow.bold('\n --------- JS Hint -------------------------------------------------->>>'));
	return gulp.src(['app/js/**/*.js']) // 'gulpfile.js'
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(stylish))
	.pipe(uglify())
	.pipe(concat('all.js'))
	.pipe(gulp.dest('build/js'));
});





/**===========================================
  			Gulp default task
=============================================*/

gulp.task('default', function() {
	console.log(chalk.yellow.bold('\n --------- Running default task -------------------------------------------------->>>'));
});



