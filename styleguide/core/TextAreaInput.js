import TextInput from './TextInput.js'

export default class TextAreaInput extends TextInput {
  constructor ($el, options) {
    super($el, {
      selectors: {
        prefix: '.TextAreaInput'
      }
    })

    this.$input.on('keypress', (e) => {
      this.onKeyPress(e)
    })
  }

  get $input () {
    return this.$context.find('textarea')
  }

  onKeyPress (event) {
    // prevent line-breaks/wrapping in the input
    if (event.which === 13) {
      event.preventDefault()
    }
  }
}
