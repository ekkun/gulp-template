const TerserPlugin = require('terser-webpack-plugin');

const devApp = {
  mode: 'development', // production, development
  entry: `./src/js/main.js`,
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
