const gulp = require('gulp');
const styleguide = require('brightspot-styleguide/tasks/all.js');

gulp.task('clean', function () {
    return styleguide.clean()
});

gulp.task('bower', ['clean'], function (cb) {
    // TODO: be more literal with what is being installed
    // .installBowerComponent('jquery', '[...]')
    return styleguide.bower()
});

gulp.task('copy-bower-components', ['bower'], function (cb) {
    return gulp.src([
            '_build/bower_components/normalize-css/normalize.css'
        ])
        .pipe(gulp.dest('_build'))
});

gulp.task('copy-src-to-temp', ['clean'], function() {
    return gulp.src(['!_build/**', './**/*.less'])
        .pipe(gulp.dest('./_build/'));
});

gulp.task('less', ['copy-src-to-temp', 'copy-bower-components'], function() {
    return gulp.src('_build/All.less')
        .pipe(styleguide.compileStyles())
        .pipe(gulp.dest('./_dist'))
});

gulp.task('systemjs', ['clean'], function (cb) {
    return gulp.src('All.js')
        // commenting out until we actually have something that will work for compileScripts
        //.pipe(styleguide.compileScripts());
        .pipe(gulp.dest('./_dist'))
});

gulp.task('default', ['less', 'systemjs'], function (cb) {
    return
});

module.exports = gulp;
