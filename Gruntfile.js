'use strict';

module.exports = function (grunt) {
    require('bsp-grunt')(grunt, {
        bsp: {

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
