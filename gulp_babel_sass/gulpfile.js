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

// JavaScript
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackProductionConfig = require('./webpack.production');
const webpackDevelopmentConfig = require('./webpack.development');

// Browser Sync
const browserSync = require('browser-sync').create();

// Delete
const del = require('del');

// Path Setting
const paths = {
  styles: {
    src: './src/sass/**/*.scss',
    dist: './assets/css/',
  },
  scripts: {
    src: './src/js/**/*.js',
    dist: './assets/js/',
  },
};

/**
 * Sass Compile
 */
// Production
const compileProductionSass = () => {
  return src(paths.styles.src) // ファイルを取得
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'), // 処理を止めない
      })
    )
    .pipe(
      sass({
        outputStyle: 'compressed', // expanded, compressed
      })
    )
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
    .pipe(dest(paths.styles.dist)); // フォルダーに保存
};
// Development
const compileDevelopmentSass = () => {
  return src(paths.styles.src, { sourcemaps: true }) // ファイルを取得
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
    .pipe(
      postCss([
        autoprefixer({
          cascade: true,
          grid: 'autoplace',
        }),
      ])
    )
    .pipe(groupCssMediaQueries())
    .pipe(dest(paths.styles.dist, { sourcemaps: './' })); // フォルダーに保存
};

/**
 * JS Bundle
 */
// Production
const bundleProductionJavaScript = () => {
  return webpackStream(webpackProductionConfig, webpack).pipe(
    dest(paths.scripts.dist)
  );
};
// Development
const bundleDevelopmentJavaScript = () => {
  return webpackStream(webpackDevelopmentConfig, webpack).pipe(
    dest(paths.scripts.dist)
  );
};

/**
 * ESLint
 */
const esLint = () => {
  return src([paths.scripts.src])
    .pipe(eslint({ useEslintrc: true, fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

/**
 * File deletion (CSS, JS)
 */
const cleanAssetsFiles = () => {
  return del([paths.styles.dist, paths.scripts.dist]);
};

/**
 * Watch (ファイル監視)
 */
const watchFiles = () => {
  watch(paths.styles.src).on('change', series(compileDevelopmentSass));
  watch(paths.scripts.src).on(
    'change',
    series(bundleDevelopmentJavaScript, esLint)
  );
};

// $ npx gulp
exports.default = series(
  parallel(
    cleanAssetsFiles,
    compileDevelopmentSass,
    bundleDevelopmentJavaScript
  ),
  series(watchFiles)
);

// $ npx gulp build
exports.build = series(
  parallel(cleanAssetsFiles, compileProductionSass, bundleProductionJavaScript)
);
