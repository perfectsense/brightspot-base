const gulp = require('gulp')
const styleguide = require('brightspot-styleguide/tasks/all.js')

gulp.task('clean', function () {
    return styleguide.clean(['_dist/**/*', '_tmp/**/*'])
})

gulp.task('install', ['clean'], function (cb) {
    // TODO: be more literal with what is being installed
    // .installBowerComponent('jquery', '[...]')
    return styleguide.install()
})

gulp.task('compile', ['install'], function (cb) {
    gulp.src('All.js')
        .pipe(styleguide.compileScripts())
})

gulp.task('default', ['compile'], function (cb) {
    return
})

module.exports = gulp
