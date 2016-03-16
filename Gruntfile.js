'use strict';

module.exports = function (grunt) {
    require('bsp-grunt')(grunt, {
        bsp: {

            bower: {
                'normalize-css': [
                    {
                        src: 'normalize.css',
                        dest: 'bower/normalize-css/normalize.css'
                    }
                ]
            },

            styles: {
                dir: '',
                less: [
                    'base/All.less',
                    'base/theme/inspire-confidence/All.less'
                ],
                options : {
                    autoprefixer: true
                }
            },

            scripts: {
                dir: ''
            }
        }
    });
};
