module.exports = function(grunt) {
  grunt.initConfig({
    jasmine: {
      src: 'js/**/*.js',
      options: {
        specs: 'spec/*spec.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jasmine');
};
