// Gulp
import gulpPackage from 'gulp';
const { gulp, src, dest, watch, lastRun, series, parallel } = gulpPackage;
import plumber from 'gulp-plumber';

// Sass
import sass from 'gulp-dart-sass';
import notify from 'gulp-notify';
import postCss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import cssNano from 'gulp-cssnano';

// JavaScript
import gulpESLint from 'gulp-eslint';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackProductionConfig from './webpack.production.js';
// const { App } = webpackProduction;
// const webpackProductionConfig = webpackProduction;
import webpackDevelopmentConfig from './webpack.development.js';
// const { devApp } = webpackDevelopment;
// const webpackDevelopmentConfig = webpackDevelopment;

// Image Compression
import imageMin from 'gulp-imagemin';
// const imageMin = require('gulp-imagemin');
import pngQuant from 'imagemin-pngquant';
// const pngQuant = require('imagemin-pngquant');
import mozJpeg from 'imagemin-mozjpeg';
// const mozJpeg = require('imagemin-mozjpeg');
import svgo from 'gulp-svgo';
// const svgo = require('gulp-svgo');
import webp from 'gulp-webp';
// const webp = require('gulp-webp');

// Browser Sync
import { create as bsCreate } from 'browser-sync';
const browserSync = bsCreate();
//const browserSync = require('browser-sync').create();

// Delete
import del from 'del';
//const del = require('del');

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
    distWebp: './assets/images/webp/',
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
          title: 'エラー',
          message: '<%= error.message %>',
        }),
      })
    )
    .pipe(
      sass({
        outputStyle: 'compressed', // expanded, compressed
      }).on('error', sass.logError)
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
        errorHandler: notify.onError({
          title: 'エラー',
          message: '<%= error.message %>',
        }),
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded', // expanded, compressed
      }).on('error', sass.logError)
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
  return webpackStream(webpackProductionConfig, webpack)
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(dest(paths.scripts.dist));
};
// Development
const bundleDevelopmentJavaScript = () => {
  return webpackStream(webpackDevelopmentConfig, webpack)
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
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
 * Image Compression
 */
const imagesCompress = () => {
  return src(paths.images.src, {
    since: lastRun(imagesCompress),
  })
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(
      imageMin(
        [
          mozJpeg({
            quality: 80, //画質
          }),
          pngQuant(
            [0.6, 0.8] //画質の最小,最大
          ),
        ],
        {
          verbose: true, //メタ情報削除
        }
      )
    )
    .pipe(
      svgo({
        plugins: [
          { removeViewbox: false },
          { removeMetadata: false },
          { convertColors: false },
          { removeUnknownsAndDefaults: false },
          { convertShapeToPath: false },
          { collapseGroups: false },
          { cleanupIDs: false },
          // { mergePaths: false },
        ],
      })
    )
    .pipe(dest(paths.images.dist));
};

/**
 * File deletion (CSS, JS, IMG)
 */
const cleanAssetsFiles = () => {
  return del([paths.styles.dist, paths.scripts.dist, paths.images.dist]);
};
const cleanMapFiles = () => {
  return del([paths.styles.map, paths.scripts.map]);
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
  watch(paths.images.src).on('change', series(imagesCompress));
};

// $ npx gulp
exports.default = series(
  parallel(
    cleanMapFiles,
    compileDevelopmentSass,
    bundleDevelopmentJavaScript,
    imagesCompress
  ),
  series(watchFiles)
);

// $ npx gulp build
exports.build = series(
  parallel(
    cleanMapFiles,
    compileProductionSass,
    bundleProductionJavaScript,
    imagesCompress
  )
);
