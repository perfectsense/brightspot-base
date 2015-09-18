import $ from 'jquery';
import bsp_utils from 'bsp-utils';

var thePlugin = {
    '_defaultOptions': {
        'disableAutocomplete': true,
        'inputSubmitDelay': 100,
        'submitThrottle': 500
    },

    '_each': function(input) {
        var plugin = this;
        var $input = $(input);
        var $form = $input.closest('form');

        var submit;
        var lastFormData;

        submit = bsp_utils.throttle(plugin.option(input, 'submitThrottle'), function() {
            var formData = $form.serialize();

            if (lastFormData !== formData) {
                lastFormData = formData;
                $form.submit();
            }
        });

        var submitCheck;
        var inputSubmitDelay = plugin.option(input, 'inputSubmitDelay');
        var submitTimer;

        submitCheck = inputSubmitDelay <= 0 ? submit : function() {
            clearTimeout(submitTimer);

            submitTimer = setTimeout(function() {
                submitTimer = null;
                submit();
            }, inputSubmitDelay);
        };

        if (plugin.option(input, 'disableAutoComplete')) {
            (input === $form[0] ? $form.find(':input') : $input).prop('autocomplete', 'off');
        }

        plugin._on(input, 'change', submit);
        plugin._on(input, 'input', submitCheck);
    }
};

export default bsp_utils.plugin(false, 'bsp', 'autosubmit', thePlugin);
