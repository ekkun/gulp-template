const TerserPlugin = require('terser-webpack-plugin');

const devApp = {
  mode: 'development', // production, development
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
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
      }),
    ],
  },
  devtool: 'source-map',
};

module.exports = devApp; //実行
