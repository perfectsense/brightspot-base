const autoprefixer = require('autoprefixer');
const Styleguide = require('brightspot-styleguide');
const gulp = require('gulp');
const file = require('gulp-file');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const Builder = require('systemjs-builder');

const styleguide = new Styleguide(gulp);

gulp.task('css', [ styleguide.task.lint.less() ], () => {
    return gulp.src(styleguide.path.src('All.less'))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([ autoprefixer('last 2 versions') ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(styleguide.path.build()));
});

gulp.task('js', [ styleguide.task.lint.js() ], (done) => {
    let builder = new Builder();

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

    builder.buildStatic(styleguide.path.src('All.js'), buildOptions).then((output) => {
        gulp.src([ ])
            .pipe(file(styleguide.path.src('All.js'), output.source))
            .pipe(gulp.dest(styleguide.path.build()))
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename({ extname: '.min.js' }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(styleguide.path.build()))
            .on('end', done);
    });
});

gulp.task('default', [ 'css', 'js' ], () => {
});

gulp.task('styleguide', () => {
    gulp.watch(styleguide.path.src('**/*.{less,vars}'), [ 'css' ]);
    gulp.watch(styleguide.path.src('**/*.js'), [ 'js' ]);
    gulp.watch(styleguide.path.src('**/*.json'), [ styleguide.task.lint.json() ]);
    styleguide.serve();
});
