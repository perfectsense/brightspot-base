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
                autoprefixer: true
            },

            scripts: {
                dir: 'assets/scripts'
            }
        }

    });

};
