module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'js/scripts.js': ['components/js/main.js']
        }
      }
    },
    compass: {
      dev: {
        options: {
          config: 'config.rb'
        }
      }
    },
    watch: {
      options: { livereload: true },
      scripts: {
        files: ['components/js/*.js'],
        tasks: ['uglify']        
      },
      sass : {
        files: ['components/sass/**/*'],
        tasks: ['compass:dev']
      }
    }
  });

  grunt.registerTask('default', 'watch');
}