module.exports = function (prefix) {
  if (!prefix) {
    prefix = 'src'
  }

  return require('./find.js')(prefix, '.hbs');
};

