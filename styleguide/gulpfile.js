var gulp = require('gulp');

// IDEA: maybe we should require these automatically or in a batch (alltasks)?
var cleanTask = require('brightspot-styleguide/tasks/clean.js')(gulp);
var installTask = require('brightspot-styleguide/tasks/install.js')(gulp);
var compileTask = require('brightspot-styleguide/tasks/compile.js')(gulp);

gulp.task('default', [
    'clean:dist',
    'clean:tmp',
    'install:bower',
    'compile:styles'
]);

module.exports = gulp;
