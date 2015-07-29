module.exports = function(grunt) {

    'use strict';

    require('bsp-grunt')(grunt, {
        bsp: {
            brightspotBase: {
                enable: true
            },
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

                // history.js and waypoints will go away when brightspot-js-infinite-content gets to be 
                // it's own separate repo vs being included directly in base

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