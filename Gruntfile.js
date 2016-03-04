module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // connect: {
    //   server: {
    //     options: {},
    //   }
    // },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'app/css/main.css': 'app/scss/main.scss'
        }
      }
    },
    jshint: {
      files: ['app/js/**/*.js'],
      predef: ['angular']
    },
    watch: {
      options: {
        livereload: true,
      },
      html: {
        options: {
          livereload: true,
        },
        files: ['index.html'],
      },
      js: {
        files: ['app/js/**/*.js'],
        tasks: ['jshint'],
      },
      sass: {
        options: {
          livereload: true
        },
        files: ['app/scss/*.scss'],
        tasks: ['sass'],
      },
      css: {
        options: {
          livereload: true
        },
        files: ['app/css/main.css'],
        tasks: []
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('default', ['watch', 'jshint']);
};