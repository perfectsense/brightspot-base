const gulp = require('gulp');
const styleguide = require('brightspot-styleguide/styleguide');

gulp.task('bower', () => {
    const bower = require('gulp-bower');

    return bower({
        cmd: 'update'
    });
});

gulp.task('css', () => {
    // TODO: lint less files via styleguide helper - maybe use? https://www.npmjs.com/package/lesshint

    const autoprefixer = require('autoprefixer');
    const less = require('gulp-less');
    const postcss = require('gulp-postcss');
    const sourcemaps = require('gulp-sourcemaps');

    return gulp.src('All.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([ autoprefixer('Last 2 versions') ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(styleguide.distPath()));
});

gulp.task('js', (done) => {
    // TODO: lint JS files via styleguide helper

    const Builder = require('systemjs-builder');
    const sourcemaps = require('gulp-sourcemaps');
    const uglify = require('gulp-uglify');
    const rename = require('gulp-rename');

    let builder = new Builder();

    // TODO: turn this into styleguide helper?
    builder.config({
        map: {
            'bsp-carousel': 'bower_components/bsp-carousel/dist/bsp-carousel/bsp-carousel.js',
            'bsp-utils': 'bower_components/bsp-utils/bsp-utils.js',
            'bsp-modal': 'bower_components/bsp-modal/src/js/bsp-modal.js',
            'masonry': 'bower_components/masonry/dist/masonry.pkgd.js',
            'jquery': 'bower_components/jquery/dist/jquery.js',
            'slick': 'bower_components/bsp-carousel/dist/bsp-carousel/slick.js',
            'vex': 'bower_components/vex/js/vex.js'
        }
    });

    let buildOptions = {
        minify: false
    };

    builder.buildStatic('All.js', buildOptions).then((output) => {
        const file = require('gulp-file');

        gulp.src([ ])
            .pipe(file('All.js', output.source))
            .pipe(sourcemaps.init())
            .pipe(gulp.dest(styleguide.distPath()))
            .pipe(uglify())
            .pipe(rename({extname: '.min.js'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(styleguide.distPath()))
            .on('end', done);
    });
});

gulp.task('styleguide', () => {
    const styleguide = require('brightspot-styleguide/lib/server');

    // TODO: turn this into styleguide helper?
    gulp.watch([ '**/*.less', '!_build/**', '!bower_components/**', '!node_modules/**' ], [ 'css' ]);
    gulp.watch([ '**/*.js', '!_build/**', '!bower_components/**', '!node_modules/**' ], [ 'js' ]);

    // TODO: turn command line arguments into options
    styleguide({
        host: 'localhost',
        port: 3000
    });
});
