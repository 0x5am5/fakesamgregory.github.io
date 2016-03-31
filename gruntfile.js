module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      my_target: {
        files: {
          'dist/js/main.js': ['components/js/main.js']
        }
      }
    },

    sass: {
      dev: {
        options: {
          style: 'expanded',
          sourcemap: 'none'
        },
        files: {
          'dist/css/main.css': 'components/sass/main.scss'
        }
      },
      build: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'compiled/css/main.css': 'components/sass/main.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'compiled/*.css',
        dest: 'dist/css/'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      grunfile: { files: 'gruntfile.js' },
      sass: {
        files: ['components/**/*.scss'],
        tasks: ['sass', 'autoprefixer']          
      },
      scripts: {
        files: ['components/js/*.js'],
        tasks: ['copy:script']
      },
      assemble: {
        files: ['components/**/*.hbs', 'components/data/*.{json,yml}'],
        tasks: ['assemble']
      },
      images: {
        files: ['images/**/*'],
        tasks: ['copy:images']
      }
    },

    copy: {
      main: {
        files: [
          // flattens results to a single level
          {expand: true, flatten: true, src: ['node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*'], dest: 'css/fonts', filter: 'isFile'},
        ],
      },
      script: {
        files: [{
          src: ['components/js/**/*'],
          dest: 'dist/js/',
          flatten: true,
          expand: true
        }]
      },
      images: {
        files: [{
          src: 'images/**/*',
          dest: 'dist/'
        }] 
      },
      fonts: {
        files: [{
          src: 'css/fonts/**/*',
          dest: 'dist/css/fonts',
          expand: true, 
          flatten: true
        }]
      },
      files : {
        files: [{
          src: ['*.pdf'],
          dest: 'dist/'
        }]
      },
      bootstrap: {
        files: [{
          src: ['node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'],
          dest: 'dist/js/',
          expand: true, 
          flatten: true
        }]
      }
    },

    assemble: {
      options: {
        assets: '/',
        partials: ['components/partials/**/*.hbs'],
        layoutdir: 'components/layouts',
        data: ['components/data/*.{json,yml}']
      },
      site: {
        options: {
          layout: 'master.hbs'
        },
       files: [
           {
              expand: true,
              cwd: 'components/pages/',
              src: '**/*.hbs',
              dest: 'dist/'
           }
        ]
      }
    },

    connect: {
      server: {
        options: {
          base: 'dist/',
          open: true,
          hostname: 'localhost'
        }        
      }
    }
  });

  grunt.registerTask('default', 
    [
    'copy', 
    'sass:dev',  
    'assemble', 
    'connect',
    'watch'
    ]
  );

  grunt.registerTask('build', 
    [
    'copy', 
    'sass:build', 
    'autoprefixer', 
    'uglify',
    'assemble',
    'connect',
    'watch'
    ]
  );
}