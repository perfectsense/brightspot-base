module.exports = function(grunt) {

    'use strict';

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
                dir: 'assets/scripts'
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
                        cwd: 'dist/bsp-carousel/',
                        src: 'bsp-carousel.css',
                        dest: '../styles/bower/bsp-carousel',
                        expand: true
                    },
                    {
                        cwd: 'dist/bsp-carousel/',
                        src: '*.js',
                        dest: '', //root of scripts
                        expand: true
                    },
                    {
                        cwd: 'dist/bsp-carousel-thumbnav/',
                        src: '*.js',
                        dest: '', //root of scripts
                        expand: true
                    },
                    {
                        cwd: 'src/less/bsp-carousel-gallery/',
                        src: '*.less',
                        dest: '../styles/bower/bsp-carousel-gallery',
                        expand: true
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

                'history.js' : {
                    src: 'scripts/bundled-uncompressed/html5/native.history.js',
                    dest: './',
                    expand: true,
                    flatten: true
                },

                'waypoints' : [
                {
                    src: 'lib/**/*.js',
                    dest: 'bower/waypoints',
                    expand: true,
                    flatten: true
                }]
            }
        }

    });

};