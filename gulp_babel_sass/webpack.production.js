const app = {
  mode: 'production', // production, development

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
};

module.exports = app; //実行
