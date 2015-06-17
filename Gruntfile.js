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
                        cwd: 'src/less/bsp-carousel-gallery-plugin/',
                        src: '*.less',
                        dest: '../styles/bower/bsp-carousel-gallery-plugin',
                        expand: true
                    },
                    {
                        cwd: 'src/templates/',
                        src: '*.hbs',
                        dest: '../../render/bower/',
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

                'text': [
                    {
                        src: 'text.js',
                        dest: '../scripts/bower/text.js'
                    }
                ]
            }
        }

    });

};
