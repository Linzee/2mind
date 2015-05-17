module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/screen.css': 'scss/app.scss'
        }        
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: ['scss/**/*.scss', 'js/2mind/*.js'],
        tasks: ['sass', 'concat', 'uglify']
      }
    },
    
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'js/2mind/*.js',
        ],
        dest: 'js/2mind.js'
      }
    },
    
    uglify: {
      dist: {
        files: {
          'js/2mind.min.js': ['js/2mind.js']
        }
      }
    },
    
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['concat', 'uglify', 'watch']);

}