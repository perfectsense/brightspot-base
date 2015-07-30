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

                // Here you can specify extra bower packages that dont come as part of base if you need them
                // if you add something into bower.json and do NOT specify in here, it will just copy whatever is
                // in that packages' bower.json main entry. Otherwise, you can grab other types of files here

                // example
                //'history.js' : {
                //    src: 'scripts/bundled-uncompressed/html5/native.history.js',
                //    dest: './',
                //    expand: true,
                //    flatten: true
                //}
                
            }
        }

    });

};