// Gulp
import pkg from 'gulp';
const { gulp, src, dest, watch, lastRun, series, parallel } = pkg;
import plumber from 'gulp-plumber';

// Sass
import sass from 'gulp-dart-sass';
import notify from 'gulp-notify';
import postCss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';

// JavaScript
import gulpESLint from 'gulp-eslint';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackProductionConfig from './webpack.production.js';
import webpackDevelopmentConfig from './webpack.development.js';

// Browser Sync
import browserSync from 'browser-sync';

// Delete
import { deleteAsync } from 'del';

// Path Setting
const paths = {
  styles: {
    src: './src/sass/**/*.scss',
    dist: './assets/css/',
    map: './assets/css/*.map',
  },
  scripts: {
    src: './src/js/**/*.js',
    dist: './assets/js/',
    map: './assets/js/*.map',
  },
  images: {
    src: './src/images/**/*.{jpg,jpeg,png,gif,svg}',
    srcWebp: './src/images/**/*.{jpg,jpeg,png}',
    dist: './assets/images/',
    distWebp: './assets/images/',
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
        errorHandler: notify.onError({
          title: 'CSS エラー',
          message: '\n' + 'Line: <%= error.line %>' + '\n' + 'File: <%= error.file %>' + '\n' + 'Error: <%= error.message %>',
        }),
      })
    )
    .pipe(
      sass
        .sync({
          outputStyle: 'compressed', // expanded, compressed
        })
        .on('error', sass.logError)
    )
    .pipe(
      postCss([
        autoprefixer({
          cascade: true,
          grid: 'autoplace', // 'autoplace' or true
        }),
      ])
    )
    .pipe(groupCssMediaQueries())
    .pipe(
      sass.sync({
        outputStyle: 'compressed', // expanded, compressed
      })
    )
    .pipe(dest(paths.styles.dist)) // フォルダーに保存
    .pipe(browserSync.stream());
};
// Development
const compileDevelopmentSass = () => {
  return (
    src(paths.styles.src, { sourcemaps: true }) // ファイルを取得
      .pipe(
        plumber({
          errorHandler: notify.onError({
            title: 'CSS エラー',
            message: '\n' + 'Line: <%= error.line %>' + '\n' + 'File: <%= error.file %>' + '\n' + 'Error: <%= error.message %>',
          }),
        })
      )
      .pipe(
        sass
          .sync({
            outputStyle: 'expanded', // expanded, compressed
          })
          .on('error', sass.logError)
      )
      .pipe(
        postCss([
          autoprefixer({
            cascade: true,
            grid: 'autoplace', // 'autoplace' or true
          }),
        ])
      )
      .pipe(groupCssMediaQueries()) // ソースマップを利用したい場合はコメントアウトしてください
      .pipe(
        sass.sync({
          outputStyle: 'expanded', // expanded, compressed
        })
      )
      .pipe(dest(paths.styles.dist, { sourcemaps: './' })) // フォルダーに保存
      //変更があった所のみコンパイル
      .pipe(browserSync.stream())
  );
};

/**
 * JS Bundle
 */
// Production
const bundleProductionJavaScript = () => {
  return webpackStream(webpackProductionConfig, webpack)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'JavaScript エラー',
          message: '\n' + 'Line: <%= error.line %>' + '\n' + 'File: <%= error.file %>' + '\n' + 'Error: <%= error.message %>',
        }),
      })
    )
    .pipe(dest(paths.scripts.dist));
};
// Development
const bundleDevelopmentJavaScript = () => {
  return webpackStream(webpackDevelopmentConfig, webpack)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'JavaScript エラー',
          message: '\n' + 'Line: <%= error.line %>' + '\n' + 'File: <%= error.file %>' + '\n' + 'Error: <%= error.message %>',
        }),
      })
    )
    .pipe(dest(paths.scripts.dist));
};

/**
 * ESLint
 */
const esLint = () => {
  return src([paths.scripts.src])
    .pipe(gulpESLint({ useEslintrc: true, fix: true }))
    .pipe(gulpESLint.format())
    .pipe(gulpESLint.failAfterError());
};

/**
 * File deletion (CSS, JS, IMG)
 */
const cleanAssetsFiles = () => {
  return deleteAsync([paths.styles.dist, paths.scripts.dist, paths.images.dist]);
};
const cleanMapFiles = () => {
  return deleteAsync([paths.styles.map, paths.scripts.map]);
};

/**
 * Watch (ファイル監視)
 */
const watchFiles = () => {
  watch(paths.styles.src).on('change', series(compileDevelopmentSass));
  watch(paths.scripts.src).on('change', series(bundleDevelopmentJavaScript, esLint));
};

// $ npx gulp
export default series(parallel(compileDevelopmentSass, bundleDevelopmentJavaScript), series(watchFiles));

// $ npx gulp build
export const build = series(parallel(cleanMapFiles, compileProductionSass, bundleProductionJavaScript));
