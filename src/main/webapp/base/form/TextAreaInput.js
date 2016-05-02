import $ from 'jquery';
import bspUtils from 'bsp-utils';
import TextInput from './TextInput.js';

class TextAreaInput extends TextInput {
    constructor($el, options) {
        super($el, {
            selectors: {
                prefix: '.TextAreaInput'
            }
        });

        this.$input.on('keypress', (e)=> {
            this.onKeyPress(e);
        });
    }

    get $input() {
        return this.$context.find('textarea');
    }

    onKeyPress(event) {
        // prevent line-breaks/wrapping in the input
        if (event.which == 13) {
            event.preventDefault();
        }
    }
}

export default bspUtils.plugin(false, 'bsp', 'form-textAreaInput', {
    '_each': function(item) {
        return new TextAreaInput($(item), this.option(item));
    }
});
