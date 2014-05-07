'use strict';

var gulp 	  = require('gulp'),
	chalk 	  = require('chalk'),
	concat 	  = require('gulp-concat'),
	jshint 	  = require('gulp-jshint'),
	minifycss = require('gulp-minify-css'),
	stylish   = require('jshint-stylish'),
	uglify    = require('gulp-uglify'),
	watch     = require('gulp-watch');

var src = {
	app : '/app',
	css : '/app/css',
	js : '/app/js',
	images : '/app/images'
};

var	build = {
	css : '/build/css',
	js : '/build/js',
	images : '/build/images'
};

// chalk config
var error = chalk.red.bold,
	hint  = chalk.yellow.bold,
	watch = chalk.green.bold;

/**================================================
  		Script Tasks -- js hint, uglify, concat
===================================================*/

gulp.task('scripts', function() {
	console.log(hint('\n --------- Running script tasks ------------------------------------------->>>'));
	return gulp.src(['app/js/**/*.js']) // 'gulpfile.js'
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(stylish))
	.pipe(concat('all.js'))
	.pipe(uglify())
	.pipe(gulp.dest('build/js'));
});

/**===============================================
  		CSS Tasks -- minify, concat
=================================================*/

gulp.task('css', function() {
	console.log(hint('\n --------- Running CSS tasks ---------------------------------------------->>>'));
	return gulp.src(['app/css/*.css'])
	.pipe(minifycss())
	.pipe(concat('styles.css'))
	.pipe(gulp.dest('build/css'));
});

/**===============================================
  		Watch -- all files
=================================================*/

gulp.task('watch', function() {
	console.log(watch('\n --------- Watching all files --------------------------------------------->>> \n'));
	var script = gulp.watch(['app/js/**/*.js'], ['scripts']),
		css    = gulp.watch(['app/css/*.css'], ['css']);

	var log = function(event) {
		console.log(watch('\n --------- Files ' + event.path + ' was ------------->>> ' + event.type));
	}

	//on change print file name and event type
	script.on('change', log);

});

/**==============================================
  		Gulp Default Tasks -- all
=================================================*/

gulp.task('default', ['scripts', 'css', 'watch']);



