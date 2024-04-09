// Gulp
const { src, dest, watch, lastRun, series, parallel } = require('gulp');
const plumber = require('gulp-plumber');

// Sass
//const sass = require('gulp-sass')(require('sass'));
const sass = require('gulp-dart-sass');
const notify = require('gulp-notify');
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const groupCssMediaQueries = require('gulp-group-css-media-queries');
const cssNano = require('gulp-cssnano');
//const gulpScssLint = require('gulp-scss-lint');

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
        sass.sync({
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
 * stylelint
 */
const stylelint = () => {
  const gulpStylelint = require('gulp-stylelint');
  return src(paths.styles.src).pipe(
    gulpStylelint({
      failAfterError: true,
      reportOutputDir: '',
      reporters: [
        //{ formatter: 'string', console: true },
        { formatter: 'string', save: 'lint_error.txt' },
        //{ formatter: 'verbose', console: true },
        //{ formatter: 'json', save: 'report-lint.json' },
      ],
      debug: true,
    })
  );
};

/**
 * Watch
 */
// ファイル監視
const watchFiles = () => {
  watch(paths.styles.src).on('change', series(compileSass));
  //watch(paths.styles.src, compileSass);
};

// $ npx gulp
exports.default = series(parallel(watchFiles));

// $ npx gulp stylelint
exports.stylelint = stylelint;
