module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      my_target: {
        files: {
          'dist/js/main.js': ['.tmp/js/main.js']
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
        files: ['components/js/**/*.js'],
        tasks: ['browserify']
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
    },

    htmlmin: {                                     
      dist: {                                      
        options: {                                 
          removeComments: true,
          collapseWhitespace: true,
          removeTagWhitespace: true,
          removeAttributeQuotes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true
        },
        files: [
           {
              expand: true,
              cwd: 'dist/',
              src: '**/*.html',
              dest: 'dist/'
           }
        ]
      }
    },

    browserify: {
         options: {
            browserifyOptions: {
               debug: true
            }
         },
         dist: {
            files: {
               '.tmp/js/main.js': 'components/js/**/*.js'
            }
         },
         dev: {
          files: {
               'dist/js/main.js': 'components/js/**/*.js'
            }
         }
      }
  });

  grunt.registerTask('default', 
    [
    'copy', 
    'browserify:dev',
    'sass:dev',  
    'assemble', 
    'connect',
    'watch'
    ]
  );

  grunt.registerTask('build', 
    [
    'copy', 
    'browserify:dist',
    'uglify',
    'sass:build', 
    'autoprefixer', 
    'assemble',
    'htmlmin',
    'connect',
    'watch'
    ]
  );
}