module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-assemble');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      my_target: {
        files: {
          'dist/js/scripts.js': ['components/js/main.js']
        }
      }
    },

    sass: {
      dev: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'dist/css/main.css': 'components/sass/main.scss'
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
        dest: ''
      }
    },

    watch: {
      options: { livereload: true },
      sass: {
        files: ['components/**/*.scss'],
        tasks: ['sass', 'autoprefixer']          
      },
      scripts: {
        files: ['components/js/*.js', 'images/*/**'],
        tasks: ['copy']
      },
      assemble: {
        files: ['components/**/*.hbs', 'components/data/*.{json,yml}'],
        tasks: ['assemble']
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
          src: ['components/js/*'],
          dest: 'dist/js/',
          flatten: true,
          expand: true
        }]
      },
      jquery: {
        files: [{
          src: 'js/jquery-1.8.2.min.js',
          dest: 'dist/'
        }]
      },
      images: {
        files: [{
          src: 'images/**/*',
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

    handlebars: {
      compile: {
        options: {
          namespace: "SG.templates"
        },
        files: {
          "path/to/result.js": "path/to/source.hbs",
          "path/to/another.js": ["path/to/sources/*.hbs", "path/to/more/*.hbs"]
        }
      }
    }

  });

  grunt.registerTask('default', 
    [
    'copy', 
    'sass', 
    'autoprefixer', 
    'assemble', 
    'watch'
    ]
  );
}