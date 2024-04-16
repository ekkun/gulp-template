const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');

const entriesJS = WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, `./src/js/*.js`)])();

const devApp = {
  mode: 'development', // production, development
  entry: entriesJS,
  output: {
    filename: 'main.js',
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
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
      }),
    ],
  },
  devtool: 'source-map',
};

module.exports = devApp; //実行
