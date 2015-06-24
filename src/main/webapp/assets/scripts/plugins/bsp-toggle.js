export default function() {}
/*
define(function(require){

    var $ = require('jquery');
    var bsp_utils = require('bsp-utils');

    var thePlugin = {

        '_defaultOptions': {
            toggleItem: '.toggle-item',
            toggleTrigger: '.toggle-trigger'
        },

        // each time stuff gets added to the DOM, pass everything that was added to the the lazy loader instance
        '_each': function(parent) {
            var options = this.option(parent);

            var $parent = $(parent);
            var $triggerItem = $parent.find(options.toggleItem);

            $parent.find(options.toggleTrigger).on('click', function(){

                $triggerItem.toggleClass('toggle-in');

                return false;
            });
        }
    };

    return bsp_utils.plugin(false, 'bsp', 'toggle-item', thePlugin);
});
*/