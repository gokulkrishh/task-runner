'use strict';

var gulp 	  	= require('gulp'),
	browserSync = require('browser-sync'),
	chalk 	  	= require('chalk'),
	gulpif 	  	= require('gulp-if'),
	open 		= require('open'),
	runSequence = require('run-sequence'),
	stylish   	= require('jshint-stylish'),
	plugins		= require('gulp-load-plugins')();

//src path
var src = {
	root : 'app',
	css : 'app/css',
	js : 'app/js',
	lib : 'app/lib',
	images : 'app/images',
	sass : './sass',
	bower : './bower_components',
	zip : './zip'
};

//build path
var	build = {
	root : 'build',
	css : 'build/css',
	js : 'build/js',
	images : 'build/images',
	templates : 'build/templates'
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

/**================================================
  		Server & livereload using gulp-connect
===================================================*/

gulp.task('server', function () {
	plugins.connect.server(serverConfig);
	console.log(hint('\n --------- Server Started http://localhost:3000 ------------------------>>> \n'));
	open('http://localhost:3000');
});

/**================================================
  		HTML -- minify html to build
===================================================*/

gulp.task('html', ['html:root'], function() {
	console.log(hint('\n --------- Running HTML tasks ------------------------------------------>>>'));
	return gulp.src(['app/**/*.html', 'app/templates/*.html'])
		.pipe(plugins.changed(build.root))
		.pipe(gulpif(production, plugins.minifyHtml(opts)))
		.pipe(plugins.size())
		.pipe(gulp.dest(build.root))
		.pipe(plugins.connect.reload());
});

gulp.task('html:root', function() {
	console.log(hint('\n --------- Running HTML root tasks ------------------------------------>>>'));
	return gulp.src(['app/*.html']) //app/index.html
		.pipe(plugins.changed(build.root))
		.pipe(gulpif(production, plugins.minifyHtml(opts)))
		.pipe(plugins.size())
		.pipe(gulp.dest(build.root))
		.pipe(plugins.connect.reload());
});

/**===============================================
  		CSS & SASS Tasks -- minify, concat
=================================================*/

gulp.task('sass', function() {
	console.log(hint('\n --------- Running SASS tasks ------------------------------------------->>>'));
    return gulp.src(['app/css/app.scss'])
	    .pipe(plugins.changed(src.sass))
	    .pipe(plugins.sass({onError: callback}))
	    .pipe(plugins.size())
	    .pipe(gulp.dest(src.sass))
	    .pipe(plugins.connect.reload());
});

var callback = function(err) {
	console.log(error('\n SASS file has error clear it to see changes, see below log ------------->>> \n'));
	console.log(error(err));
};

gulp.task('css', ['sass'], function() {
	console.log(hint('\n --------- Running CSS tasks -------------------------------------------->>>'));
	return gulp.src(['app/css/*.css', 'sass/app.css'])
		.pipe(plugins.changed(src.sass))
		.pipe(gulpif(production, plugins.minifyCss()))
		.pipe(plugins.concat('styles.css'))
		.pipe(plugins.size())
		.pipe(gulp.dest(build.css))
		.pipe(plugins.connect.reload());
});

/**================================================
  		Script Tasks -- js hint & uglify & concat
===================================================*/

gulp.task('scripts', function() {
	console.log(hint('\n --------- Running SCRIPT tasks ----------------------------------------->>>'));
	return gulp.src(['app/js/**/*.js', 'gulpfile.js']) // 'gulpfile.js'
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter(stylish))
		.pipe(plugins.changed(build.js))
		.pipe(plugins.concat('all.js'))
		.pipe(gulpif(production, plugins.uglify()))
		.pipe(plugins.size())
		.pipe(gulp.dest(build.js))
		.pipe(plugins.connect.reload());
});

/**================================================
  		Concat - all bower packages
===================================================*/

gulp.task('concat-bower', function() {
	console.log(hint('\n --------- Bower Concat ------------------------------------------------->>> \n'));
	var jsFilter   = plugins.filter('**/*.js'),
		cssFilter  = plugins.filter('**/*.css');

	//for js files
	return plugins.bowerFiles(bowerConfig)
		.pipe(jsFilter)
		.pipe(plugins.concat('bower.js'))
		.pipe(gulpif(production, plugins.uglify()))
		.pipe(plugins.size())
		.pipe(gulp.dest(build.js))
		.pipe(jsFilter.restore())

		//for css files
		.pipe(cssFilter)
		.pipe(plugins.concat('bower.css'))
		.pipe(gulpif(production, plugins.uglify()))
		.pipe(plugins.size())
		.pipe(gulp.dest(build.css))
		.pipe(cssFilter.restore())
		.pipe(plugins.connect.reload());
});

/**================================================
  			Images minification
===================================================*/

gulp.task('img-min', function () {
	console.log(hint('\n --------- Image Minification -------------------------------------------->>> \n'));
	return gulp.src(['app/images/*.*'])
		.pipe(plugins.imagemin())
		.pipe(plugins.size())
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
	html.once('change', log);
	script.once('change', log);
	css.once('change', log);
	sass.once('change', log);
	imgMin.once('change', log);
	bower.once('change', log);

});

/**================================================
  		Clean - remove files and folder in build
===================================================*/

function cleanFiles(files, log) {
	console.log(hint('\n --------- Clean:'+ log + 'tasks ------------------------------------------>>> \n'));
	return gulp.src(files, {read : false })
	.pipe(plugins.ignore(['node_modules/**', 'bower_components/**']))
	.pipe(plugins.rimraf());
}

gulp.task('clean', function() {
	cleanFiles(build.root, 'All Build Files');
});

gulp.task('cleanZip', function() {
	cleanFiles(src.zip + '!./build-*.zip', 'Zip Files');
});

/**================================================
  		Browser sync to sync with browser
==================================================*/

gulp.task('browserSync', function () {
	browserSync.init([build.root + '/*.html', build.root + '/**/*.html', build.css + '**/*.css', build.js + '**/*.js', build.images + '/*.*'], {
		server : {
			baseDir : './build',
		}
	});
});

/**================================================
  		Zip all build files with date
==================================================*/

gulp.task('zip', function() {
	var date = new Date().toDateString();
	console.log(hint('\n --------- Zipping Build Files ------------------------------------------>>> \n'));
	return gulp.src([build.root + '/*'])
	.pipe(plugins.zip('build-'+ date + '.zip'))
	.pipe(plugins.size())
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