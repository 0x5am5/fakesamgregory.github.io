module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  var config = {
      dist: 'docs',
      src: 'src'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: config,

    uglify: {
      my_target: {
        files: {
          '<%= config.dist %>/js/main.js': ['.tmp/js/main.js']
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
          '<%= config.dist %>/css/main.css': 'components/sass/main.scss'
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
        dest: '<%= config.dist %>/css/main.css'
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
        dest: '<%= config.dist %>/css/fonts', 
        filter: 'isFile'
      },
      images: {
        expand: true,
        flatten: true,
        cwd: 'components/images/',
        src: '*.{jpg,gif,png}',
        dest: '<%= config.dist %>/images/'
      },
      fonts: {
        cwd: 'css/fonts/',
        src: '**/*',
        dest: '<%= config.dist %>/css/fonts',
        expand: true
      },
      files: {
        src: ['*.pdf', 'favicon.ico'],
        dest: '<%= config.dist %>/'
      },
      json: {
        expand: true,
        cwd: 'components/js/',
        src: 'json/*.json',
        dest: '<%= config.dist %>/js/'
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
          dest: '<%= config.dist %>/images/'
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
          dest: '<%= config.dist %>/'
        }]
      }
    },

    connect: {
      server: {
        options: {
          base: '<%= config.dist %>/',
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
          cwd: '<%= config.dist %>/',
          src: '**/*.html',
          dest: '<%= config.dist %>/'
        }]
      }
    },

    browserify: {
      options: {
        browserifyOptions: {
          debug: true,
          transform: [['babelify', {presets: ['react']}]]
        },
      },
      dist: {
        files: {
          '.tmp/js/main.js': 'components/js/**/*.js'
        }
      },
      dev: {
        files: {
          '<%= config.dist %>/js/main.js': 'components/js/**/*.js'
        }
      }
    },

    imagemin: {                       
      dynamic: {                      
        files: [{
          expand: true,               
          cwd: '<%= config.dist %>/images/',                
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= config.dist %>/images/'               
        }]
      }
    },

    clean: {
      build: ['<%= config.dist %>/'],
      images: ['<%= config.dist %>/images']
    },

    env : {
      dist : {
        NODE_ENV : 'production',
        DEST     : 'dist'        
      },
      dev : {
        NODE_ENV : 'development',
        DEST     : 'dist'        
      },
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
      'env:dev',
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
    'env:dist',
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