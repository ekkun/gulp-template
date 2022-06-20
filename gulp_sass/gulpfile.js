// Gulp
const { src, dest, watch, lastRun, series, parallel } = require('gulp');

// Sass
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
//const autoprefixer = require('gulp-autoprefixer');
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const groupCssMediaQueries = require('gulp-group-css-media-queries');
const cssNano = require('gulp-cssnano');

// Sourcemaps
//const sourcemaps = require('gulp-sourcemaps');

// Browser Sync
//const browserSync = require('browser-sync').create();

// Path Setting
const paths = {
  styles: {
    src: './sass/**/*.scss',
    dist: './assets/css/',
  },
};

/**
 * Sass Compile
 */
const compileSass = () => {
  return (
    src(paths.styles.src, { sourcemaps: true }) // ファイルを取得
      //.pipe(sourcemaps.init())
      .pipe(
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>'), // 処理を止めない
        })
      )
      .pipe(
        sass({
          outputStyle: 'expanded', // expanded, compressed
        })
      )
      //.pipe(autoprefixer(['last 2 versions', 'ie >= 11']))
      .pipe(
        postCss([
          autoprefixer({
            cascade: true,
            grid: 'autoplace',
          }),
        ])
      )
      .pipe(groupCssMediaQueries())
      .pipe(cssNano())
      .pipe(dest(paths.styles.dist, { sourcemaps: './' })) // フォルダーに保存
  );
};

/**
 * Watch
 */
// ファイル監視
const watchFiles = () => {
  watch(paths.styles.src, compileSass);
};

// $ npx gulp
exports.default = series(parallel(watchFiles));
