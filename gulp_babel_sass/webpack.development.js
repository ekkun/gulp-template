const devApp = {
  mode: 'development', // production, development

  entry: `./src/js/main.js`,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                  ie: '11',
                },
              },
            ],
          ],
        },
      },
    ],
  },

  output: {
    filename: 'main.js',
  },

  devtool: 'source-map',
};

module.exports = devApp; //実行
