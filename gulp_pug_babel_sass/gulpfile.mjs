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

// PUG
import prettify from 'gulp-prettify';
import pug from 'gulp-pug';
import { htmlValidator } from 'gulp-w3c-html-validator';

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

// Image Compression
import imageMin from 'gulp-imagemin';
import pngQuant from 'imagemin-pngquant';
import mozJpeg from 'imagemin-mozjpeg';
import svgo from 'gulp-svgo';
import webp from 'gulp-webp';

// Browser Sync
import browserSync from 'browser-sync';

// Delete
import { deleteAsync } from 'del';

// Path Setting
const paths = {
  pug: {
    src: ['./src/pug/**/*.pug', '!./src/pug/**/_*.pug'],
    dist: './public/',
    watch: './src/pug/**/*.pug',
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

// HTML整形
const html = () => {
  return src(paths.pug.static, { since: lastRun(html) })
    .pipe(
      prettify({
        indent_char: ' ',
        indent_size: 2,
        unformatted: ['a', 'span', 'br'],
      })
    )
    .pipe(dest(paths.pug.dist));
};

/**
 * PUG
 */
const pugs = () => {
  return src(paths.pug.src, { since: lastRun(html) })
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(pug({ pretty: true, indent_with_tabs: false, indent_size: 2 }))
    .pipe(dest(paths.pug.dist));
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
 * HTML Validator
 */
const validateHtml = () => {
  return src([paths.html.dist]).pipe(htmlValidator.analyzer()).pipe(htmlValidator.reporter());
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
 * Webp
 */
const toWebp = () => {
  return src(paths.images.srcWebp).pipe(webp()).pipe(dest(paths.images.dist));
};
const toStaticWebp = () => {
  return src(paths.images.staticWebp).pipe(webp()).pipe(dest(paths.images.dist));
};

/**
 * File Copy
 */
// HTML
const htmlCopy = () => {
  return src(paths.pug.static).pipe(dest(paths.pug.dist));
};
// JS
const jsCopy = () => {
  return src(paths.scripts.static).pipe(dest(paths.scripts.dist));
};
// CSS
const cssCopy = () => {
  return src(paths.styles.static).pipe(dest(paths.styles.dist));
};
// IMAGES
const imagesCopy = () => {
  return src(paths.images.static).pipe(dest(paths.images.dist));
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
  watch(paths.pug.watch, series(pugs, browserReloadFunc));
  watch(paths.pug.static, series(htmlCopy, browserReloadFunc));
  watch(paths.html.dist).on('change', series(validateHtml));
  watch(paths.scripts.src).on('change', series(bundleDevelopmentJavaScript, esLint, browserReloadFunc));
  watch(paths.scripts.static, series(jsCopy, browserReloadFunc));
  watch(paths.styles.src).on('change', series(compileDevelopmentSass));
  watch(paths.styles.static, series(cssCopy));
  watch(paths.images.src).on('change', series(imagesCompress));
  watch(paths.images.static, series(imagesCopy, browserReloadFunc));
  watch(paths.images.srcWebp).on('change', series(toWebp));
  watch(paths.images.staticWebp).on('change', series(toStaticWebp));
  watch(paths.fonts.src, series(fontsCopy, browserReloadFunc));
  watch(paths.json.src, series(jsonCopy, browserReloadFunc));
};

// $ npx gulp
export default series(parallel(cleanAllFiles), parallel(pugs, htmlCopy, bundleDevelopmentJavaScript, jsCopy, compileDevelopmentSass, cssCopy, imagesCompress, imagesCopy, toWebp, toStaticWebp, fontsCopy, jsonCopy), series(browserSyncFunc, watchFiles));

// $ npx gulp dev
export const dev = series(parallel(cleanAllFiles), parallel(pugs, htmlCopy, bundleDevelopmentJavaScript, jsCopy, compileDevelopmentSass, cssCopy, imagesCompress, imagesCopy, toWebp, toStaticWebp, fontsCopy, jsonCopy));

// $ npx gulp build
export const build = series(parallel(cleanAllFiles), parallel(cleanAllFiles, pugs, htmlCopy, bundleProductionJavaScript, jsCopy, compileProductionSass, cssCopy, imagesCompress, imagesCopy, toWebp, toStaticWebp, fontsCopy, jsonCopy));
