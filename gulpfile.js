const autoprefixer = require('autoprefixer')
const Styleguide = require('brightspot-styleguide')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const Builder = require('systemjs-builder')

const styleguide = new Styleguide(gulp)

gulp.task(styleguide.task.less(), () => {
  return gulp.src('styleguide/All.less', { base: '.' })
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less({ modifyVars: { _demo: true } }))
    .pipe(plugins.postcss([ autoprefixer('last 2 versions') ]))
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename({ extname: '.min.css' }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(styleguide.path.build()))
})

gulp.task(styleguide.task.js(), (done) => {
  let builder = new Builder()

  builder.config({
    defaultJSExtensions: true,
    map: {
      'bsp-carousel': 'node_modules/bsp-carousel/dist/bsp-carousel/bsp-carousel.js',
      'bsp-modal': 'node_modules/bsp-modal/src/js/bsp-modal.js',
      'bsp-utils': 'node_modules/bsp-utils/bsp-utils.js',
      'jquery': 'node_modules/jquery/dist/jquery.js',
      'masonry': 'node_modules/masonry-layout/masonry.js',
      'outlayer/outlayer': 'node_modules/outlayer/outlayer.js',
      'get-size/get-size': 'node_modules/get-size/get-size.js',
      'ev-emitter/ev-emitter': 'node_modules/ev-emitter/ev-emitter.js',
      'fizzy-ui-utils/utils': 'node_modules/fizzy-ui-utils/utils.js',
      'desandro-matches-selector/matches-selector': 'node_modules/desandro-matches-selector/matches-selector.js',
      'slick': 'node_modules/bsp-carousel/dist/bsp-carousel/slick.js',
      'vex': 'node_modules/vex-js/js/vex.js'
    }
  })

  let buildOptions = {
    minify: false
  }

  builder.buildStatic('styleguide/All.js', buildOptions).then((output) => {
    gulp.src([ ])
      .pipe(plugins.file('styleguide/All.js', output.source))
      .pipe(gulp.dest(styleguide.path.build()))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.uglify())
      .pipe(plugins.rename({ extname: '.min.js' }))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest(styleguide.path.build()))
      .on('end', done)
  })
})
