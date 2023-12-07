const TerserPlugin = require('terser-webpack-plugin');

const App = {
  mode: 'production', // production, development
  //entry: `./src/js/main.js`,
  entry: {
    main: `./src/js/main.js`,
    home: `./src/js/home.js`,
    // others: `./src/js/others.js`,
  },
  output: {
    //filename: 'main.js',
    filename: '[name].js',
    path: __dirname + '/public',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  target: ['web', 'es5'],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
        extractComments: false,
      }),
    ],
  },
};

module.exports = App; //実行
