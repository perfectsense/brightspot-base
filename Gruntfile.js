'use strict';

module.exports = function (grunt) {
    require('bsp-grunt')(grunt, {
        bsp: {

            bower: {
                // Gallery uses Masonry javascript, which has a few dependencies
                // BEGIN dependencies for Masonry
                'outlayer': [
                    {
                        src: 'outlayer.js',
                        dest: 'outlayer/outlayer.js'
                    },
                    {
                        src: 'item.js',
                        dest: 'outlayer/item.js'
                    }
                ],
                'ev-emitter': [
                    {
                        src: 'ev-emitter.js',
                        dest: 'ev-emitter/ev-emitter.js'
                    }
                ],
                'get-size': [
                    {
                        src: 'get-size.js',
                        dest: 'get-size/get-size.js'
                    }
                ],
                'fizzy-ui-utils': [
                    {
                        src: 'utils.js',
                        dest: 'fizzy-ui-utils/utils.js'
                    }
                ],
                'desandro-matches-selector': [
                    {
                        src: 'matches-selector.js',
                        dest: 'desandro-matches-selector/matches-selector.js'
                    }
                ]
                // END dependencies for Masonry
            },
            
            styles: {
                dir: '',
                less: [
                    'base/All.less',
                    'base/Gallery.less'
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
