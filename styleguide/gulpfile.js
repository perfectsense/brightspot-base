const gulp = require('gulp');
const runSequence = require('run-sequence');
const Styleguide = require('brightspot-styleguide/styleguide.js');

var styleguide = new Styleguide({ });

// the clean styleguide tasks blanks out the _build and _dist directories
gulp.task('clean', function () {
    return styleguide.clean();
});

// simple bower install that goes through your bower.json and brings those components down into the _build/bower_components folder
gulp.task('bower-install', function () {
    return styleguide.bowerInstall();
});

// this task gathers all the js, less, and css from this folders and copies it to _build so we can do our compilation there
gulp.task('copy-src', function() {
    return styleguide.copySrc();
});

// Using the bower.json defined in each Bower component, this copies the specified main file
// into the `_build` directory. If the bower component you're installing doesn't specify a main file,
// you can define it manually in your bower.json's "overrides" data.
gulp.task('copy-bower', function () {
    return styleguide.copyBower();
});
// gulp.task('copy-custom-bower-files', ['bower-install'], function (cb) {
//     return  gulp.src('./_build/bower_components/my-bowered-in-component')
//                 .pipe(gulp.dest('./_dist/custom-directory-for-bowered-in-component'))
// });

gulp.task('less', function () {
    return gulp.src('_build/All.less')
        .pipe(styleguide.compileStyles())
        .pipe(gulp.dest(styleguide.distRoot()));
});

gulp.task('scripts', function () {
    return styleguide.compileScripts()
});

gulp.task('compile', function (cb) {
    runSequence('clean', 'bower-install', ['copy-src', 'copy-bower'], ['less', 'scripts'], cb)
})

gulp.task('default', ['compile'], function () {
    return
});

gulp.task('watch', function () {
     gulp.watch('bower_components/**', ['copy-bower'])
})

module.exports = gulp;
