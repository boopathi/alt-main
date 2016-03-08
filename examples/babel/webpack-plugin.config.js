var AltMainPlugin = require('alt-main-plugin');
module.exports = {
  entry: './webpack-plugin.js',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ["web_modules", "node_modules"],
    extensions: ["", ".js", ".web.js"]
  },
  plugins: [
    new AltMainPlugin()
  ]
};
