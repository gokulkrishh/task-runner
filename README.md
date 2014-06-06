Task run using gulp.js 
=================================================
    Task run is initially aimed to ease the pain of minification and linting of html, js, css, image files and blah blah blah.

Installation guide:
=====================
    
    1. Copy all your existing files to app/ or create your own files in folder structure like below
    
    app/           (development directory)
      -js/         (js files)
      -lib/        (library files)
      -css/        (both sass and css files & import sass files to app.scss)
      -images/     (images)
    
    2. Import your SASS files to app.scss and thats it.

    3. Enter gulp in termainal to see the magic.
    
Run following command:
========================
    
    1. gulp (dev mode)
    2. gulp prod (production mode)

To install new library through bower:
======================================

    Node is required to use this command
    
    1. node -v to check node is installed or not
    2. If not go to http://nodejs.org/ to install
    
    bower install <library-name> --save-dev

Manually add library:
=====================

    1. Add library for eg: Jquery

    app/
      -js/ (add here)

Seperate gulp commands:
=========================

    1. gulp<space>zip           -- To create a zip folder of your development
    2. gulp<space>html          -- To concat and minify(production mode)
    3. gulp<space>css           -- To convert sass to css and concat to one single file
    4. gulp<space>scripts       -- To lint and concat to one single file
    5. gulp<space>img-min       -- To minify image files
    6. gulp<space>concat-bower  -- To concat all bower dependencies in one single file
    7. gulp<space>watch         -- To watch all file changes and do all above tasks

