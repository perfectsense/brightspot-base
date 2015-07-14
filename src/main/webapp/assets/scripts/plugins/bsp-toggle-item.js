import $ from 'jquery';
import bsp_utils from 'bsp-utils';
export default bsp_utils.plugin(false, 'bsp', 'toggle-item', {

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

            $(this).toggleClass('toggle-trigger-in');

            // gets the base class from the trigger item
            var baseClass = $triggerItem.attr('class').split(' ')[0];

            $('body').toggleClass(baseClass + '-toggle-in');
            
            $triggerItem.toggleClass('toggle-in');

            return false;
        });
    }
});