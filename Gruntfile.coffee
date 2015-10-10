{ normalize } = require 'path'

module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  
  grunt.initConfig

    wcjs:
      version: '0.1.35'
        
      platform: 
        runtime: 'electron'
        version: '0.33.3'

    dist: normalize "#{__dirname}/dist"

    concat:
      js:
        src: [
          'src/vendor/js/**/*.js'
          'src/vendor/js/**'
        ]
        dest: 'build/js/vendor.js'
      
      css:
        src: [
          'src/vendor/css/**/*.css'
          'src/vendor/css/**'
        ]
        dest: 'build/css/vendor.css'

    copy: 
      build:
        src: ['package.json']
        dest: normalize "#{__dirname}/build"
        expand: true
      main: 
        files: [
          { expand: true, cwd: 'src/assets/', src: ['**'], dest: 'build' }
        ]
      node_modules: 
        files: [
          { expand: true, cwd: 'node_modules/', src: ['**'], dest: 'build/node_modules' }
        ]

    clean:
      build: src: [ normalize("#{__dirname}/build") ]

    coffee:
      app: 
        options: 
          bare: true
          join: true
        files: 'build/js/app.js': ['src/client/*.coffee', 'src/client/**/**.coffee']
      main:
        expand: true
        cwd: 'src/scripts'
        src: [ '**/*.coffee' ]
        dest: 'build/scripts/'
        ext: '.js'

    # https://www.npmjs.com/package/grunt-angular-templates
    ngtemplates:
      app: 
        cwd: 'src/client/'
        src: ['**/*.html']
        dest: 'build/js/templates.js'

    # https://www.npmjs.com/package/grunt-ng-annotate
    ngAnnotate:
      build: 
        files: 'build/js/app.js': [ 'build/js/app.js' ]

    stylus:
      build:
        options:
          'resolve url': true
          use: [ 'nib' ]
          compress: false
          paths: [ '/styl' ]
        
        expand: true
        join: true
        files: 'build/css/app.css': ['src/client/**/*.styl', 'src/client/**/**.styl']

  grunt.registerTask 'default', [ 'clean', 'coffee', 'ngtemplates', 'ngAnnotate', 'concat', 'copy:build', 'copy:main', 'stylus' ]
 