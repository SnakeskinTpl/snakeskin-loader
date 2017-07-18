snakeskin-loader
================

Using [Snakeskin](https://github.com/SnakeskinTpl/Snakeskin) with [WebPack](http://webpack.github.io).

[![NPM version](http://img.shields.io/npm/v/snakeskin-loader.svg?style=flat)](http://badge.fury.io/js/snakeskin-loader)
[![Build Status](http://img.shields.io/travis/SnakeskinTpl/snakeskin-loader.svg?style=flat&branch=master)](https://travis-ci.org/SnakeskinTpl/snakeskin-loader)
[![NPM dependencies](http://img.shields.io/david/SnakeskinTpl/snakeskin-loader.svg?style=flat)](https://david-dm.org/SnakeskinTpl/snakeskin-loader)
[![NPM devDependencies](http://img.shields.io/david/dev/SnakeskinTpl/snakeskin-loader.svg?style=flat)](https://david-dm.org/SnakeskinTpl/snakeskin-loader?type=dev)
[![NPM peerDependencies](http://img.shields.io/david/peer/SnakeskinTpl/snakeskin-loader.svg?style=flat)](https://david-dm.org/SnakeskinTpl/snakeskin-loader?type=peer)

## Install

```bash
# WebPack 1
npm install snakeskin snakeskin-loader@webpack1 --save-dev

# WebPack 2+
npm install snakeskin snakeskin-loader --save-dev
```

## Usage
### Webpack 1

**webpack.config.json**

```js
var webpack = require('webpack');

webpack({
  entry: {
      index: './index.js'
  },

  output: {
      filename: '[name].bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.ss$/,
        exclude: /node_modules/,
        loader: 'snakeskin-loader?localization=false&exec=true'
      }
    ]
  },

  snakeskin: {
    babel: {
      plugins: [require('babel-plugin-transform-async-to-generator')]
    }
  }
}, function (err, stats) {
    // ...
});
```

### Webpack 2+

**webpack.config.json**

```js
var webpack = require('webpack');

webpack({
  entry: {
      index: './index.js'
  },

  output: {
      filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'snakeskin-loader',
            options: {
              localization: false,
              exec: true,
              babel: {
                plugins: [require('babel-plugin-transform-async-to-generator')]
              }
            }
          }
        ]
      }
    ]
  }
  
}, function (err, stats) {
    // ...
});
```

## [Options](http://snakeskintpl.github.io/docs/api.html#compile--opt_params)
### adapter

Type: `String`

Name of the adaptor, for example:

* [ss2react](https://github.com/SnakeskinTpl/ss2react) compiles Snakeskin for React
* [ss2vue](https://github.com/SnakeskinTpl/ss2vue) compiles Snakeskin for Vue2

### adapterOptions

Type: `Object`

Options for the used adaptor.

### exec

Type: `Boolean`

Default: `false`

If the parameter is set to `true` the template will be launched after compiling and the results of it work will be saved.

### tpl

Type: `String`

The name of the executable template (if is set `exec`), if the parameter is not specified, then uses the rule:

```js
%fileName% || main || index || Object.keys().sort()[0];
```

### data

Type: `?`

Data for the executable template (if is set `exec`).

## [License](https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE)

The MIT License.
