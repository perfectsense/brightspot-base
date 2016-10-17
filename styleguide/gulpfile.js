const gulp = require('gulp')
const styleguide = require('brightspot-styleguide/tasks/all.js')

gulp.task('clean', function() {
    return styleguide.clean(['_dist/**/*', '_tmp/**/*'])
})

gulp.task('install', ['clean'], function(cb) {
    return styleguide.install()
})

gulp.task('default', ['install'], function(cb) {
    return
})

module.exports = gulp
