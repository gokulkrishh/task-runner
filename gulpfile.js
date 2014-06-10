'use strict';

var gulp 	  	= require('gulp'),
	bower 		= require('gulp-bower-files'),
	chalk 	  	= require('chalk'),
	concat 	  	= require('gulp-concat'),
	connect  	= require('gulp-connect'),
	filter  	= require('gulp-filter'),
	gulpif 	  	= require('gulp-if'),
	imagemin 	= require('gulp-imagemin'),
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
	sass : './sass',
	bower : './bower_components'
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
};


//bower config
var bowerConfig = {
	paths: {
	    bowerDirectory: 'bower_components',
	    bowerrc: '.bowerrc',
	    bowerJson: 'bower.json'
	}
};

//zip config
var date  	   = new Date(),
	dateString = date.toDateString();

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
    .pipe(sass({onError: callback}))
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
	console.log(hint('\n --------- Bower Concat ------------------------------------------------->>> \n'));
	var jsFilter   = filter('**/*.js'),
		cssFilter  = filter('**/*.css'),
		fileFilter = filter('!**/*.min.js', '!**/*.js', '!**/*.scss');

	//for js files
	return bower(bowerConfig)
	.pipe(jsFilter)
	.pipe(concat('_bower.js'))
	.pipe(gulpif(production, uglify()))
	.pipe(gulp.dest(build.js))
	.pipe(jsFilter.restore())

	//for css files
	.pipe(cssFilter)
	.pipe(concat('_bower.css'))
	.pipe(gulpif(production, uglify()))
	.pipe(gulp.dest(build.css))
	.pipe(cssFilter.restore())
	.pipe(connect.reload());
});

/**================================================
  			Images minification
===================================================*/

gulp.task('img-min', function () {
	console.log(hint('\n --------- Image Minification -------------------------------------------->>> \n'));
	return gulp.src(['app/images/*.*'])
	.pipe(imagemin())
	.pipe(gulp.dest(build.images));
});

/**===============================================
  		Watch -- all files
=================================================*/

gulp.task('watch', function() {
	console.log(hint('\n --------- Watching All Files ------------------------------------------->>> \n'));
	var html   	= gulp.watch(['app/*.html'], ['html']),
		script 	= gulp.watch(['app/js/**/*.js'], ['scripts']),
		css    	= gulp.watch(['app/css/*.css'], ['css']),
		sass   	= gulp.watch(['app/css/*.scss'], ['css']),
		imgMin  = gulp.watch(['app/images/*.*'], ['img-min']),
		bower   = gulp.watch(['bower_components/**/*.*', 'bower_components/**/*.js', 'bower_components/*.js', 'bower.json'], ['concat-bower']);

	var log = function(event) {
		console.log(change('\n -- File ' + event.path + ' was ' + event.type + ' -->>>'));
	};

	//on change print file name and event type
	html.on('change', log);
	script.on('change', log);
	css.on('change', log);
	sass.on('change', log);
	imgMin.on('change', log);
	bower.on('change', log);

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
	runSequence('html', 'scripts', 'css', 'concat-bower', 'img-min', 'server', 'watch');
});

gulp.task('prod', function() {
	console.log(hint('\n --------- Build Production Mode  --------------------------------------->>> \n'));
	production = true;
	runSequence('html', 'scripts', 'css', 'concat-bower', 'img-min', 'server', 'watch');
});


/**==============================================
  		Gulp Default Tasks -- build
=================================================*/

gulp.task('default', ['build']);