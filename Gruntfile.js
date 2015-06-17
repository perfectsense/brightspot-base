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
                ]
            }
        }

    });

};
