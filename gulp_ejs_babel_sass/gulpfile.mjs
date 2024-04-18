// Gulp
import pkg from 'gulp';
const { gulp, src, dest, watch, lastRun, series, parallel } = pkg;
import plumber from 'gulp-plumber';

// Environment Setting
import minimist from 'minimist';
const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: {
    env: '',
  },
});
if (options.env === 'prod') {
  // 本番環境
  process.env = Object.assign(process.env, {
    state: 'prod',
    //domain: 'https://prod.com',
  });
} else if (options.env === 'dev') {
  // テスト環境
  process.env = Object.assign(process.env, {
    state: 'dev',
    //domain: 'https://dev.com',
  });
} else {
  // ローカル環境
  process.env = Object.assign(process.env, {
    state: '',
    //domain: 'http://localhost:4000',
  });
}
//console.info(process.env.domain);

// EJS
//import fs from 'fs';
import htmlMin from 'gulp-htmlmin';
import prettify from 'gulp-prettify';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
//import htmlhint from 'gulp-htmlhint';
import { htmlValidator } from 'gulp-w3c-html-validator';
//import through2 from 'through2';

// JavaScript
import gulpESLint from 'gulp-eslint';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackProductionConfig from './webpack.production.js';
import webpackDevelopmentConfig from './webpack.development.js';

// Sass
import sass from 'gulp-dart-sass';
import notify from 'gulp-notify';
import postCss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';

// Browser Sync
import browserSync from 'browser-sync';

// Delete
//import del from 'del';
import { deleteAsync } from 'del';

// Path Setting
const paths = {
  ejs: {
    src: ['./src/ejs/**/*.ejs', '!./src/ejs/**/_*.ejs'],
    dist: './public/',
    watch: './src/ejs/**/*.ejs',
    static: './src/static/html/**/*.html',
  },
  html: {
    dist: 'public/**/*.html',
  },
  scripts: {
    src: './src/js/**/*.js',
    dist: './public/assets/js/',
    map: './public/assets/js/*.map',
    static: './src/static/js/**/*.js',
  },
  styles: {
    src: './src/sass/**/*.scss',
    dist: './public/assets/css/',
    map: './public/assets/css/*.map',
    static: './src/static/css/**/*.css',
  },
  images: {
    src: './src/images/**/*.{jpg,jpeg,png,gif,svg}',
    srcWebp: './src/images/**/*.{jpg,jpeg,png}',
    dist: './public/assets/images/',
    distWebp: './public/assets/images/webp/',
    static: './src/static/images/**/*.{jpg,jpeg,png,gif,svg,ico}',
    staticWebp: './src/static/images/**/*.{jpg,jpeg,png}',
  },
  fonts: {
    src: './src/static/fonts/**/*.{otf,ttf,woff,woff2,eot}',
    dist: './public/assets/fonts/',
  },
  json: {
    src: './src/static/json/**/*.json',
    dist: './public/',
  },
  del: {
    all: './public/',
    assets: './public/assets/',
    html: './public/!(assets)**',
    css: './public/assets/css/',
    js: './public/assets/js/',
    images: './public/assets/images/',
    fonts: './public/assets/fonts/',
    json: './public/assets/json/',
  },
};

/**
 * EJS Compile
 */
const ejsCompile = () => {
  //const data = JSON.parse(fs.readFileSync('./src/ejs/config.json')); // 設定ファイル
  return (
    src(paths.ejs.src)
      .pipe(
        plumber({
          errorHandler: notify.onError('Error: <%= error.message %>'),
        })
      )
      //.pipe(ejs(data))
      .pipe(ejs())
      .pipe(
        rename({
          extname: '.html',
        })
      )
      .pipe(
        htmlMin({
          // オプション参照：https://github.com/kangax/html-minifier
          removeComments: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          preserveLineBreaks: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
      .pipe(
        prettify({
          indent_with_tabs: false,
          indent_size: 2,
        })
      )
      .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, '$1'))
      .pipe(dest(paths.ejs.dist))
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
 * HTML Hint
 */
const htmlhintLint = () => {
  return src([paths.html.dist]).pipe(htmlhint('.htmlhintrc')).pipe(htmlhint.reporter());
};

/**
 * HTML Validator
 */
/*const handleFile = (file, encoding, callback) => {
  callback(null, file);
  if (!file.w3cHtmlValidator.validates) throw Error('HTML failed validation');
};*/
const validateHtml = () => {
  return src([paths.html.dist]).pipe(htmlValidator.analyzer()).pipe(htmlValidator.reporter());
  //return src([paths.html.dist]).pipe(htmlValidator.analyzer()).pipe(through2.obj(handleFile));
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
          grid: true, // 'autoplace' or true
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
  return src(paths.styles.src, { sourcemaps: true }) // ファイルを取得
    .pipe(
      plumber({
        //errorHandler: notify.onError('Error: <%= error.message %>'),
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
          grid: true, // 'autoplace' or true
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
    .pipe(browserSync.stream());
};

/**
 * File Copy
 */
// HTML
const htmlCopy = () => {
  return src(paths.ejs.static).pipe(dest(paths.ejs.dist));
};
// JS
const jsCopy = () => {
  return src(paths.scripts.static).pipe(dest(paths.scripts.dist));
};
// CSS
const cssCopy = () => {
  return src(paths.styles.static).pipe(dest(paths.styles.dist));
};
// FONT
const fontsCopy = () => {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dist));
};
// JSON
const jsonCopy = () => {
  return src(paths.json.src).pipe(dest(paths.json.dist));
};

/**
 * Local server startup
 */
const browserSyncFunc = (done) => {
  browserSync.init({
    //notify: false, // CONNECTED 非表示
    port: 4000,
    server: {
      baseDir: './public/',
      index: 'index.html',
    },
    //startPath: './public/index.html',
    reloadOnRestart: true,
    open: false,
    //browser: ['google chrome', 'firefox'],
  });
  done();
};

/**
 * Local server reload
 */
const browserReloadFunc = (done) => {
  browserSync.reload();
  done();
};

/**
 * File deletion
 */
const cleanAllFiles = () => {
  return deleteAsync(paths.del.all);
};
//const cleanAssetsFiles = () => {
//  return del([paths.styles.dist, paths.scripts.dist, paths.images.dist]);
//};
//const cleanMapFiles = () => {
//  return del([paths.styles.map, paths.scripts.map]);
//};

/**
 * Watch (ファイル監視)
 */
const watchFiles = () => {
  watch(paths.ejs.watch, series(ejsCompile, browserReloadFunc));
  watch(paths.ejs.static, series(htmlCopy, browserReloadFunc));
  watch(paths.html.dist).on('change', series(validateHtml));
  watch(paths.scripts.src).on('change', series(bundleDevelopmentJavaScript, esLint, browserReloadFunc));
  watch(paths.scripts.static, series(jsCopy, browserReloadFunc));
  watch(paths.styles.src).on('change', series(compileDevelopmentSass));
  watch(paths.styles.static, series(cssCopy));
  watch(paths.fonts.src, series(fontsCopy, browserReloadFunc));
  watch(paths.json.src, series(jsonCopy, browserReloadFunc));
};

// $ npx gulp
export default series(parallel(ejsCompile, htmlCopy, bundleDevelopmentJavaScript, jsCopy, compileDevelopmentSass, cssCopy, fontsCopy, jsonCopy), series(browserSyncFunc, watchFiles));

// $ npx gulp dev
export const dev = series(parallel(cleanAllFiles), parallel(ejsCompile, htmlCopy, bundleDevelopmentJavaScript, jsCopy, compileDevelopmentSass, cssCopy, fontsCopy, jsonCopy));

// $ npx gulp build
export const build = series(parallel(cleanAllFiles), parallel(cleanAllFiles, ejsCompile, htmlCopy, bundleProductionJavaScript, jsCopy, compileProductionSass, cssCopy, fontsCopy, jsonCopy));
