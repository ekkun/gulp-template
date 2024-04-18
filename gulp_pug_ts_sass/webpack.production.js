const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');

const entriesTS = WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, `./src/js/*.ts`)])();

const App = {
  mode: 'production', // production, development
  entry: entriesTS,
  output: {
    filename: '[name].js',
    path: __dirname + '/public',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
  watchOptions: {
    ignored: /node_modules/,
  },
};

module.exports = App; //実行
