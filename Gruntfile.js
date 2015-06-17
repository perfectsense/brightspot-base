module.exports = function(grunt) {

    'use strict';

    // When we run grunt via the maven build, this doesnt exist yet, as its something that is done by the bsp-grunt task
    // but when we run our grunt watcher, it assumes its run after bsp-grunt is done, and this file already exists
    var targetDir = '';
    try {
        targetDir = grunt.file.read('target/grunt-dest');
    }
    catch(err) {}

    // when we do go through maven, this option gets set and we can gather the targetDir from the variable rather than the file
    var buildName = grunt.option('bsp-maven-build-finalName');
    if(buildName) {
        targetDir = buildName;
    }

    var path = require('path');

    grunt.loadNpmTasks('grunt-contrib-handlebars');

    require('bsp-grunt')(grunt, {

        bsp: {
            styles: {
                dir: 'assets/styles',
                less: [
                    ' *.less'
                ],
                autoprefixer: false
            },

            scripts: {
                dir: 'assets/scripts',
                rjsModules: [
                    {
                        name: 'main'
                    }
                ]
            },

            bower: {

                'bootstrap': [
                    {
                        cwd: 'less/',
                        src: '**/*',
                        dest: 'bower/bootstrap',
                        expand: true,
                        flatten: false
                    },
                    {
                        cwd: 'js/',
                        src: '**/*',
                        dest: 'bower/bootstrap',
                        expand: true,
                        flatten: false
                    }
                ],

                'bsp-carousel': [
                    {
                        cwd: 'dist/',
                        src: 'bsp-carousel.css',
                        dest: '../styles/bower/bsp-carousel',
                        expand: true
                    },
                    {
                        cwd: 'dist/',
                        src: '*.js',
                        dest: '', //root of scripts
                        expand: true
                    }
                ],

                'bsp-templates': [
                    {
                        src: 'dist/bsp-template-plugin.js',
                        dest: '../scripts/bower/bsp-template-plugin.js'
                    }
                ],

                'fontawesome': [
                    {
                        src: 'less/*',
                        dest: '../styles/bower/fontawesome',
                        expand: true,
                        flatten: true
                    },
                    {
                        src: 'fonts/*',
                        dest: '../fonts',
                        expand: true,
                        flatten: true
                    }
                ],

                'handlebars': [
                    {
                        src: 'handlebars.js',
                        dest: '../scripts/bower/handlebars.js'
                    }
                ],

                'requirejs': {
                  dynamic: {
                    options: {
                      paths: {
                        'bsp-templates': 'empty:'
                      }
                    }
                  }
                }
            }
        }

    });

};
