module.exports = function (prefix) {
  if (!prefix) {
    prefix = 'styleguide'
  }

  return require('./find.js')(prefix, '.json');
};

