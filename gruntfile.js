module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  var config = {
      dist: 'assets',
      src: 'app'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: config,

    uglify: {
      my_target: {
        files: {
          '<%= config.dist %>/js/main.js': ['<%= config.dist %>/js/main.js']
        },
        options: {
          compress: true
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
          '<%= config.dist %>/css/main.css': '<%= config.src %>/sass/main.scss'
        }]
      },
      build: {
        options: {
          style: 'compressed',
          sourceMap: false
        },
        files: [{
          '<%= config.dist %>/css/main.css': '<%= config.src %>/sass/main.scss'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      multiple_files: {
        src: '<%= config.dist %>/css/main.css',
        dest: '<%= config.dist %>/css/main.css'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      gruntfile: { files: 'gruntfile.js' },
      sass: {
        files: ['<%= config.src %>/**/*.scss'],
        tasks: ['sass', 'autoprefixer']          
      },
      scripts: {
        files: ['<%= config.src %>/js/**/*.js'],
        tasks: ['browserify:dev']
      },
      assemble: {
        files: ['<%= config.src %>/**/*.hbs', '<%= config.src %>/data/*.{json,yml}'],
        tasks: ['assemble']
      },
      images: {
        files: ['<%= config.src %>/images/**/*'],
        tasks: ['clean:images', 'copy:images', 'imageloop']
      },
      json: {
        cwd: '<%= config.src %>/js/',
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
        src: '<%= config.src %>/images/*.{jpg,gif,png}',
        dest: '<%= config.dist %>/images/'
      },
      files: {
        src: ['*.pdf', 'favicon.ico'],
        dest: '<%= config.dist %>/'
      },
      json: {
        expand: true,
        flatten: true,
        src: '<%= config.src %>/js/json/*.json',
        dest: '<%= config.dist %>/js/json'
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
          src: ['<%= config.src %>/images/logos/*.{jpg,gif,png}'],
          dest: '<%= config.dist %>/images/'
        }]
      }
    },

    assemble: {
      options: {
        assets: '<%= config.dist %>',
        partials: ['<%= config.src %>/partials/*.hbs'],
        layout: ['<%= config.src %>/layouts/master.hbs'],
        data: ['<%= config.src %>/data/*.{json,yml}']
      },
      site: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.src %>/pages/*.hbs',
          dest: './'
        }]
      }
    },

    connect: {
      server: {
        options: {
          base: '',
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
          '<%= config.dist %>/js/main.js': '<%= config.src %>/js/**/*.js'
        }
      },
      dev: {
        files: {
          '<%= config.dist %>/js/main.js': '<%= config.src %>/js/**/*.js'
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
  //   grunt.file.recurse('<%= config.src %>/images/logos', function(abspath, rootdir, subdir, filename) {
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
  //   grunt.file.write('<%= config.src %>/data/work.json', JSON.stringify(images));
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
    'copy:main', 'copy:files', 'copy:json', 'copy:images',
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