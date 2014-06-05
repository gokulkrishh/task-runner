'use strict';

var gulp 	  	= require('gulp'),
	concatBower = require('gulp-bower-files'),
	chalk 	  	= require('chalk'),
	concat 	  	= require('gulp-concat'),
	connect  	= require('gulp-connect'),
	gulpif 	  	= require('gulp-if'),
	jshint 	  	= require('gulp-jshint'),
	refresh  	= require('gulp-livereload'),
	minifycss 	= require('gulp-minify-css'),
	minifyhtml 	= require('gulp-minify-html'),
	open 		= require('open'),
	path 		= require('path'),
	runSequence = require('run-sequence'),
	stylish   	= require('jshint-stylish'),
	sass        = require('gulp-sass'),
	uglify    	= require('gulp-uglify'),
	watch     	= require('gulp-watch'),
	zip 		= require('gulp-zip');

//src path
var src = {
	root : 'app',
	css : 'app/css',
	js : 'app/js',
	lib : 'app/lib',
	images : 'app/images',
	sass : './sass'
};

//build path
var	build = {
	root : 'build',
	css : 'build/css',
	js : 'build/js',
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
	change = chalk.red;

//server and live reload config
var serverConfig = {
	root : 'build',
	host : 'localhost',
	port : 3000,
	livereload: true
}

//zip config
var date  	   = new Date(),
	dateString = date.toDateString(); //Thu Jun 05 2014


/**================================================
  		Server & livereload using gulp-connect
===================================================*/

gulp.task('server', function () {
	connect.server(serverConfig);
	console.log(hint('\n --------- Server Started http://localhost:3000 ------------------------>>> \n'));
	open('http://localhost:3000');
});

/**================================================
  		HTML -- minify html to build
===================================================*/

gulp.task('html', function() {
	console.log(hint('\n --------- Running HTML tasks ------------------------------------------>>>'));
	return gulp.src(['app/*.html'])
	.pipe(gulpif(production, minifyhtml(opts)))
	.pipe(gulp.dest(build.root))
	.pipe(connect.reload());
});

/**===============================================
  		CSS & SASS Tasks -- minify, concat
=================================================*/

gulp.task('sass', function() {
	console.log(hint('\n --------- Running SASS tasks ------------------------------------------->>>'));
    return gulp.src(['app/css/app.scss'])
    .pipe(sass({onError: callback})) //to show error log add this --> errLogToConsole: true
    .pipe(gulp.dest(src.sass))
    .pipe(connect.reload());
});

var callback = function(err) {
	console.log(error('\n SASS file has error clear it to see changes, see below log ------------->>> \n'));
	console.log(error(err));
};

gulp.task('css', ['sass'], function() {
	console.log(hint('\n --------- Running CSS tasks -------------------------------------------->>>'));
	return gulp.src(['app/css/*.css', 'sass/app.css'])
	.pipe(gulpif(production, minifycss()))
	.pipe(concat('styles.css'))
	.pipe(gulp.dest(build.css))
	.pipe(connect.reload());
});

/**================================================
  		Script Tasks -- js hint & uglify & concat
===================================================*/

gulp.task('scripts', function() {
	console.log(hint('\n --------- Running SCRIPT tasks ----------------------------------------->>>'));
	return gulp.src(['app/js/**/*.js']) // 'gulpfile.js'
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(stylish))
	.pipe(concat('all.js'))
	.pipe(gulpif(production, uglify()))
	.pipe(gulp.dest(build.js))
	.pipe(connect.reload());
});

/**================================================
  		Concat - all bower packages
===================================================*/

gulp.task('concat-bower', function() {
	concatBower().pipe(concat('bowerFiles.js'))
	.pipe(gulpif(production, uglify()))
	.pipe(gulp.dest(build.js));
});


/**===============================================
  		Watch -- all files
=================================================*/

gulp.task('watch', function() {
	console.log(hint('\n --------- Watching All Files ------------------------------------------->>> \n'));
	var html   = gulp.watch(['app/*.html'], ['html']),
		script = gulp.watch(['app/js/**/*.js'], ['scripts']),
		css    = gulp.watch(['app/css/*.css'], ['css']),
		sass   = gulp.watch(['app/css/*.scss'], ['css']);

	var log = function(event) {
		console.log(change('\n -- File ' + event.path + ' was ' + event.type + ' -->>> \n'));
	};

	//on change print file name and event type
	html.on('change', log);
	script.on('change', log);
	css.on('change', log);
	sass.on('change', log);

});

/**================================================
  		Zip all build files with date
==================================================*/

gulp.task('zip', function() {
	console.log(hint('\n --------- Zipping Build Files ------------------------------------------>>> \n'));
	return gulp.src(['build/**/'])
	.pipe(zip('build - ' +  date + ' ' + '.zip'))
	.pipe(gulp.dest('./zip/'));
});

/**===============================================
  		Gulp build Tasks - dev, production
=================================================*/

gulp.task('build', function() {
	console.log(hint('\n --------- Build Development Mode  -------------------------------------->>> \n'));
	runSequence('html', 'scripts', 'css', 'concat-bower', 'server', 'watch');
});

gulp.task('prod', function() {
	console.log(hint('\n --------- Build Production Mode  --------------------------------------->>> \n'));
	production = true;
	runSequence('html', 'scripts', 'css', 'concat-bower', 'server', 'watch');
});


/**==============================================
  		Gulp Default Tasks -- build
=================================================*/

gulp.task('default', ['build']);