Task Runner using gulp.js 
=================================================
    Task Runner is initially aimed to ease the pain of minification and linting of html, js, css, image 
    files and blah blah blah. Go to installation guide.

Required Dependencies:
=======================
    Make sure Node && Bower installed

    1. node -v & bower -v to check node is installed or not
    2. If not go to (http://nodejs.org/)
    3. After node installation, 

        npm install bower -g

Installation guide:
=====================
    
    1. Copy all your existing files to app/ or create your own files in folder structure like below
    
        app/           (development directory)
          -js/         (js files)
          -lib/        (library files)
          -css/        (both sass and css files & import sass files to app.scss)
          -images/     (images)
    
    2. Import your SASS files to app.scss and thats it.

    3. Enter gulp in terminal to see the magic.
    
Run following command:
========================
    
    1. gulp (dev mode)
    2. gulp prod (production mode) to uglify JS files and minify both CSS & HTML files

To install new library through bower:
======================================

    Again make sure Node && Bower installed
    
    bower install <library-name> --save-dev

Manually add library:
=====================

    1. Add library for eg: jquery

        app/
          -js/ (add jquery.js file here)

Seperate gulp commands:
=========================

    1. gulp<space>zip           -- To create a zip folder of your development
    2. gulp<space>html          -- To copy html files to build/
    3. gulp<space>css           -- To convert sass to css and concat into one single file
    4. gulp<space>scripts       -- To lint and concat into one single file
    5. gulp<space>img-min       -- To minify image files
    6. gulp<space>concat-bower  -- To concat all bower dependencies in one single file
    7. gulp<space>watch         -- To watch all file changes and do all above tasks

