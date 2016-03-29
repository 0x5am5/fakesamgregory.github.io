module.exports = function(grunt) {


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      my_target: {
        files: {
          'js/scripts.js': ['components/js/main.js']
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
          'css/main.css': 'components/sass/main.scss'
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
        files: ['components/js/*.js'],
        tasks: ['copy:script']
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
          src: ['components/js/main.js'],
          dest: 'js/scripts.js'
        }]
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

  grunt.registerTask('default', ['copy', 'watch', 'handlebars']);
}