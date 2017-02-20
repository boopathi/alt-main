# alt-main

[![Greenkeeper badge](https://badges.greenkeeper.io/boopathi/alt-main.svg)](https://greenkeeper.io/)

Alternative main. Adds the second fallback to module resolution by replacing the require statements for directory requires.

1. `<name>/package.json->main`
2. `<name>/index.js`
3. `<name>/<name>.js`

This project provides the following plugins -

### [webpack-plugin](packages/alt-main-plugin)

### [babel-plugin](packages/babel-plugin-alt-main)

## LICENSE

MIT LICENSE - https://boopathi.mit-license.org/2016

## Why ?

When developing apps, it became a practice to name the primary file in a directory to be the same name as that of the directory.

It makes stack traces more interesting and the editor's fuzzy filename matching much more simple. This isn't a website and the `index.html -> index.js` is just weird sometimes.

```
project/
  - a/
    - a.js
  - b/
    - b.js
```

This is common pattern in many packages.

+ https://github.com/jashkenas/underscore/blob/master/package.json#L17
+ https://github.com/lodash/lodash/blob/master/package.json#L5
+ https://github.com/AmpersandJS/ampersand-collection/blob/master/package.json#L39

And to solve this within a project, we had to include a `package.json` inside every directory and have a `main` field that's the same as the directory name.

So, this project aims to add a second fallback after `index.js` to resolve `./<name>` to `./<name>/<name>.js` by REPLACING the `require` statements during the `build` (transpile / bundle) step.

#### webpack

I'm considering React apps as an example here. When we bundle react components using webpack, our requires look like this -

```js
import MyButton from '../components/MyButton/MyButton.js';
```

and with the `alt-main-plugin` webpack plugin, now we can do this

```js
import MyButton from '../components/MyButton';
```

and when you add `components` to `modulesDirectories` in webpack config,

```js
import MyButton from 'MyButton';
```

#### babel

When transpiling, the `babel-plugin-alt-main` would replace the require statements to the right fallback and choose alternative main when it's available.

```js
const MyModule = require('./MyModule');
```

would be transpiled to

```js
const MyModule = require('./MyModule/MyModule.js');
```
