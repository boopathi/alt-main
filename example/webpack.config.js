var AltMainPlugin = require('../webpack-plugin');
module.exports = {
  entry: './index.js',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new AltMainPlugin()
  ]
};
