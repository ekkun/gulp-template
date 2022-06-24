const App = {
  mode: 'development', // production, development
  entry: './src/js/main.js',
  output: {
    filename: './main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['es2015']],
            },
          },
        ],
      },
    ],
  },
};

module.exports = App;
