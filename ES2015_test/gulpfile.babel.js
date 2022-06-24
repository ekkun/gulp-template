// Gulp
import { gulp, src, dest, watch, lastRun, series, parallel } from 'gulp';

// Webpack
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

// Path Setting
const paths = {
  scripts: {
    src: './src/js/**/*.js',
    dist: './assets/js/',
  },
};

const bundleJavaScript = () => {
  return webpackStream(webpackConfig, webpack).pipe(dest(paths.scripts.dist));
  //return webpackStream(webpackProductionConfig, webpack)
  //  .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
  //  .pipe(dest(paths.scripts.dist));
};

//gulp.task('webpack', () => {
//  return webpackStream(webpackConfig, webpack).pipe(gulp.dest('dist'));
//});

// ファイル監視
const watchFiles = () => {
  watch(paths.scripts.src, bundleJavaScript);
};

// $ npx gulp
exports.default = series(parallel(watchFiles));
