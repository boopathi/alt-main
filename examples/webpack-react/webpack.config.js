const AltMainPlugin = require('alt-main-plugin');

module.exports = {
  entry: './entry.js',
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['components', 'node_modules'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new AltMainPlugin()
  ]
};
