const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');

const entriesTS = WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, `./src/js/*.ts`)])();

const devApp = {
  mode: 'development', // production, development
  entry: entriesTS,
  output: {
    filename: '[name].js',
    path: __dirname + '/public',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: ['web', 'es5'],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
      }),
    ],
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
};

module.exports = devApp; //実行
