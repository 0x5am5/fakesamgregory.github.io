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
          sourceMap: true
        },
        files: [{
          'dist/css/main.css': 'components/sass/main.scss'
        }]
      },
      build: {
        options: {
          style: 'compressed',
          sourceMap: false
        },
        files: [{
          'compiled/css/main.css': 'components/sass/main.scss'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      multiple_files: {
        src: 'compiled/css*/main.css',
        dest: 'dist/css/main.css'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      gruntfile: { files: 'gruntfile.js' },
      sass: {
        files: ['components/**/*.scss'],
        tasks: ['sass', 'autoprefixer']          
      },
      scripts: {
        files: ['components/js/**/*.js'],
        tasks: ['browserify:dev']
      },
      assemble: {
        files: ['components/**/*.hbs', 'components/data/*.{json,yml}'],
        tasks: ['assemble']
      },
      images: {
        files: ['components/images/**/*'],
        tasks: ['clean:images', 'copy:images', 'imageloop']
      },
      json: {
        cwd: 'components/js/',
        files: ['json/*.json'],
        tasks: ['copy:json']
      },
    },

    copy: {
      main: {
        expand: true, 
        src: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/*', 
        dest: 'dist/css/fonts', 
        filter: 'isFile'
      },
      images: {
        expand: true,
        flatten: true,
        cwd: 'components/images/',
        src: '*.{jpg,gif,png}',
        dest: 'dist/images/'
      },
      fonts: {
        cwd: 'css/fonts/',
        src: '**/*',
        dest: 'dist/css/fonts',
        expand: true
      },
      files: {
        src: ['*.pdf', 'favicon.ico'],
        dest: 'dist/'
      },
      json: {
        expand: true,
        cwd: 'components/js/',
        src: 'json/*.json',
        dest: 'dist/js/'
      }
    },

    responsive_images: {
      images: {
        options: {
          sizes: [
            {
              name: 'small',
              width: '112',
              height: '112',
              rename: false
            },
            {
              name: "large",
              width: '225',
              height: '225',
              suffix: "@2x",
              rename: false
            }
          ]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['*.{jpg,gif,png}'],
          cwd: 'components/images/logos/',
          dest: 'dist/images/'
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
        files: [{
          expand: true,
          cwd: 'components/pages/',
          src: '**/*.hbs',
          dest: 'dist/'
        }]
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
        files: [{
          expand: true,
          cwd: 'dist/',
          src: '**/*.html',
          dest: 'dist/'
        }]
      }
    },

    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        transform: [['babelify', {presets: ['react']}]]
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
    },

    imagemin: {                       
      dynamic: {                      
        files: [{
          expand: true,               
          cwd: 'dist/images/',                
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/images/'               
        }]
      }
    },

    clean: {
      build: ['dist/'],
      images: ['dist/images']
    }
    
  });

  // grunt.registerTask('imageloop', function() {
  //   var images = [];
  //   grunt.file.recurse('components/images/logos', function(abspath, rootdir, subdir, filename) {
  //     if (filename.match(/jpg|gif|png/)) {
  //       var ext = filename.match(/jpg|gif|png/);
  //       images.push(
  //         { 
  //           src: filename,
  //           filename: filename.replace(/.(jpg|gif|png)/, ''),
  //           ext: ext
  //          }
  //       );
  //     }
  //   });
  //   grunt.file.write('components/data/work.json', JSON.stringify(images));
  // });

  grunt.registerTask('default',
    [
      'clean:build',
      'copy', 
      // 'imageloop',
      'responsive_images',
      'browserify:dev',
      'sass:dev', 
      'assemble', 
      'connect',
      'watch'
    ]
  );

  grunt.registerTask('build', 
    [
    'clean:build',
    // 'imageloop',
    'copy:main', 'copy:fonts', 'copy:files', 'copy:json', 'copy:images',
    'responsive_images',
    'imagemin', 
    'browserify:dist',
    'uglify',
    'sass:build', 
    'autoprefixer', 
    'assemble',
    'htmlmin'
    ]
  );
}