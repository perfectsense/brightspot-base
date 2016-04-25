import $ from 'jquery';
import bspUtils from 'bsp-utils';

export default class TextInput {

    constructor($el, options) {
        this.selectors = $.extend({}, {
            prefix: '.TextInput',
            characterCountdown: 'characterCountdown'
        }, options);

        this.$context = $el;

        this.$input.on('keyup', (e)=> {
            this.onKeyUp(e);
        });
    }

    get $input() {
        return this.$context.find('input');
    }

    get $countDown() {
        return this.$context.find(`${this.selectors.prefix}-${this.selectors.characterCountdown}`);
    }

    get previousLength() {
        let int = this.$countDown.text().match(/[0-9 , \.]+/g);
        return (int[0] && int[0].length) ? int[0].trim() : null;
    }

    get length() {
        return this.$input.val().length;
    }

    get remainingCharacters() {
        let length = this.$input.attr('maxlength') - this.length;
        if (length < 0) length = 0; // just in case :)
        return length;
    }

    updateCountdown() {
        let text = this.$countDown.text();
        let charsLeft = this.remainingCharacters;
        let lastLength = this.previousLength;

        if (lastLength) {
            text = text.replace(lastLength, charsLeft);
        } else {
            text = charsLeft;
        }

        this.$countDown.text(text);
    }

    onKeyUp(event) {
        this.updateCountdown();
    }
};

bspUtils.plugin(false, 'bsp', 'form-textInput', {
    '_each': function(item) {
        return new TextInput($(item), this.option(item));
    }
});
