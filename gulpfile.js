'use strict';

var gulp 	  	= require('gulp'),
	concatBower = require('gulp-bower-files'),
	chalk 	  	= require('chalk'),
	concat 	  	= require('gulp-concat'),
	gulpif 	  	= require('gulp-if'),
	jshint 	  	= require('gulp-jshint'),
	livereload  = require('gulp-livereload'),
	minifycss 	= require('gulp-minify-css'),
	minifyhtml 	= require('gulp-minify-html'),
	runSequence = require('run-sequence'),
	stylish   	= require('jshint-stylish'),
	uglify    	= require('gulp-uglify'),
	watch     	= require('gulp-watch');

var src = {
	root : 'app',
	css : 'app/css',
	js : 'app/js',
	lib : 'app/lib',
	images : 'app/images'
};

var	build = {
	root : 'build',
	css : 'build/css',
	js : 'build/js',
	lib : 'build/lib',
	images : 'build/images'
};

var production = false;

// minify html options
var opts = {
	comments: false, 
	quotes: true, 
	spare:true, 
	empty: true, 
	cdata:true
};

// chalk config
var error  = chalk.red.bold,
	hint   = chalk.yellow.bold,
	change  = chalk.red;

/**================================================
  		HTML -- minify html to build
===================================================*/

gulp.task('html', function() {
	console.log(hint('\n --------- Running html tasks --------------------------------------------->>>'));
	return gulp.src(['app/*.html'])
	.pipe(gulpif(production, minifyhtml(opts)))
	.pipe(gulp.dest(build.root))
	.pipe(livereload());
});

/**===============================================
  		CSS Tasks -- minify, concat
=================================================*/

gulp.task('css', function() {
	console.log(hint('\n --------- Running css tasks ---------------------------------------------->>>'));
	return gulp.src(['app/css/*.css'])
	.pipe(gulpif(production, minifycss()))
	.pipe(concat('styles.css'))
	.pipe(gulp.dest(build.css))
	.pipe(livereload());
});

/**================================================
  		Script Tasks -- js hint, uglify, concat
===================================================*/

gulp.task('scripts', function() {
	console.log(hint('\n --------- Running script tasks ------------------------------------------->>>'));
	return gulp.src(['app/js/**/*.js']) // 'gulpfile.js'
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(stylish))
	.pipe(concat('all.js'))
	.pipe(gulpif(production, uglify()))
	.pipe(gulp.dest(build.js))
	.pipe(livereload());
});

/**================================================
  		Concat - all bower packages
===================================================*/

gulp.task('concat-bower', function() {
	concatBower().pipe(concat('bowerFiles.js'))
	.pipe(gulpif(production, uglify()))
	.pipe(gulp.dest(build.lib));
});


/**===============================================
  		Watch -- all files
=================================================*/

gulp.task('watch', function() {
	console.log(hint('\n --------- Watching all files --------------------------------------------->>> \n'));
	var html = gulp.watch(['app/js/*.html'], ['html']),
		script = gulp.watch(['app/js/**/*.js'], ['scripts']),
		css    = gulp.watch(['app/css/*.css'], ['css']);

	var log = function(event) {
		console.log(change('\n -- File ' + event.path + ' was ' + event.type + ' -->>> \n'));
	}

	//on change print file name and event type
	html.on('change', log);
	script.on('change', log);
	css.on('change', log);

});

/**==============================================
  		Gulp build Tasks - dev, production
=================================================*/

gulp.task('build', function() {
	console.log(hint('\n --------- Build Development Mode  ---------------------------------------->>> \n'));
	runSequence('html', 'scripts', 'css', 'concat-bower', 'watch');
});

gulp.task('prod', function() {
	console.log(hint('\n --------- Build Production Mode  --------------------------------------------->>> \n'));
	production = true;
	runSequence('html', 'scripts', 'css', 'concat-bower', 'watch');
});


/**==============================================
  		Gulp Default Tasks -- all
=================================================*/

gulp.task('default', ['build']);



