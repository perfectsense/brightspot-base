const gulp = require('gulp');
const styleguide = require('brightspot-styleguide/tasks/all.js');

// the clean styleguide tasks blanks out the _build and _dist directories
gulp.task('clean', function () {
    return styleguide.clean();
});

// simple bower install that goes through your bower.json and brings those components down into the _build/bower_components folder
gulp.task('bower-install', ['clean'], function () {
    return styleguide.bowerInstall();
});

// this task gathers all the js, less, and css from this folders and copies it to _build so we can do our compilation there
gulp.task('copy-src', ['clean'], function() {
    return styleguide.copySrc();
});

// the copyBower styleguide task goes through the main entries in your bower.json dependencies and copies those files
// from those components to the root of _build for compiling. If you want to override what to copy in from your bowered component,
// you can create a "overrides" object with alternate main entries to copy those items into the root of _build instead/
// If you need to copy to somewhere that is NOT root, add an ignore: true to the override for that bower component
// and copy manually like the example below
gulp.task('copy-bower', ['bower-install'], function () {
    return styleguide.copyBower();
});
// gulp.task('copy-custom-bower-files', ['bower-install'], function (cb) {
//     return  gulp.src('./_build/bower_components/my-bowered-in-component')
//                 .pipe(gulp.dest('./_dist/custom-directory-for-bowered-in-component'))
// });

gulp.task('less', ['copy-src', 'copy-bower'], function() {
    return gulp.src('_build/All.less')
        .pipe(styleguide.compileStyles())
        .pipe(gulp.dest('./_dist'));
});

gulp.task('systemjs', ['copy-src', 'copy-bower'], function (cb) {
    return gulp.src('_build/All.js')
        // commenting out until we actually have something that will work for compileScripts
        //.pipe(styleguide.compileScripts());
        .pipe(gulp.dest('./_dist'));
});

gulp.task('default', ['less', 'systemjs'], function (cb) {
    return;
});

module.exports = gulp;
