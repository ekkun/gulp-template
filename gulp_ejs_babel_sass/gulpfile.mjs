// Gulp
const { gulp, src, dest, watch, lastRun, series, parallel } = require('gulp');
const plumber = require('gulp-plumber');

// Environment Setting
const minimist = require('minimist');
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
const fs = require('fs');
const htmlMin = require('gulp-htmlmin');
const prettify = require('gulp-prettify');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

// JavaScript
const gulpESLint = require('gulp-eslint');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackProductionConfig = require('./webpack.production');
const webpackDevelopmentConfig = require('./webpack.development');

// Sass
const sass = require('gulp-dart-sass');
const notify = require('gulp-notify');
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const groupCssMediaQueries = require('gulp-group-css-media-queries');
const cssNano = require('gulp-cssnano');

// Image Compression
const imageMin = require('gulp-imagemin');
const pngQuant = require('imagemin-pngquant');
const mozJpeg = require('imagemin-mozjpeg');
const svgo = require('gulp-svgo');
const webp = require('gulp-webp');

// Browser Sync
const browserSync = require('browser-sync').create();

// Delete
const del = require('del');

// Path Setting
const paths = {
  ejs: {
    src: ['./src/ejs/**/*.ejs', '!./src/ejs/**/_*.ejs'],
    dist: './public/',
    watch: './src/ejs/**/*.ejs',
    static: './src/static/html/**/*.html',
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
  },
  fonts: {
    src: './src/static/fonts/**/*.{otf,ttf,woff,woff2}',
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
      // .pipe(groupCssMediaQueries())
      .pipe(dest(paths.styles.dist, { sourcemaps: './' })) // フォルダーに保存
      .pipe(browserSync.stream())
  );
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
  return del(paths.del.all);
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
  watch(paths.scripts.src).on(
    'change',
    series(bundleDevelopmentJavaScript, esLint, browserReloadFunc)
  );
  watch(paths.scripts.static, series(jsCopy, browserReloadFunc));
  watch(paths.styles.src).on('change', series(compileDevelopmentSass));
  watch(paths.styles.static, series(cssCopy));
  watch(paths.images.src).on('change', series(imagesCompress));
  watch(paths.images.static, series(imagesCopy, browserReloadFunc));
  watch(paths.fonts.src, series(fontsCopy, browserReloadFunc));
  watch(paths.json.src, series(jsonCopy, browserReloadFunc));
};

// $ npx gulp
exports.default = series(
  parallel(cleanAllFiles),
  parallel(
    ejsCompile,
    htmlCopy,
    bundleDevelopmentJavaScript,
    jsCopy,
    compileDevelopmentSass,
    cssCopy,
    imagesCompress,
    imagesCopy,
    fontsCopy,
    jsonCopy
  ),
  series(browserSyncFunc, watchFiles)
);

// $ npx gulp dev
exports.dev = series(
  parallel(cleanAllFiles),
  parallel(
    ejsCompile,
    htmlCopy,
    bundleDevelopmentJavaScript,
    jsCopy,
    compileDevelopmentSass,
    cssCopy,
    imagesCompress,
    imagesCopy,
    fontsCopy,
    jsonCopy
  )
);

// $ npx gulp build
exports.build = series(
  parallel(cleanAllFiles),
  parallel(
    cleanAllFiles,
    ejsCompile,
    htmlCopy,
    bundleProductionJavaScript,
    jsCopy,
    compileProductionSass,
    cssCopy,
    imagesCompress,
    imagesCopy,
    fontsCopy,
    jsonCopy
  )
);
