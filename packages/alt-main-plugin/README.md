# alt-main-plugin

```sh
npm install alt-main-plugin --save-dev
```

## Usage

Just include this plugin (Zero configuration), in your webpack config.

```js
var AltMainPlugin = require('alt-main-plugin');
module.exports = {
  plugins: [
    new AltMainPlugin()
  ]
};
```

+ supports modules configured under `options.resolve.modulesDirectories`
+ supports custom extensions configured under `options.resolve.extensions`
