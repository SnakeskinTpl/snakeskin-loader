snakeskin-loader
================

Using [Snakeskin](https://github.com/SnakeskinTpl/Snakeskin) with [WebPack](http://webpack.github.io).

[![NPM version](http://img.shields.io/npm/v/snakeskin-loader.svg?style=flat)](http://badge.fury.io/js/snakeskin-loader)
[![NPM dependencies](http://img.shields.io/david/SnakeskinTpl/snakeskin-loader.svg?style=flat)](https://david-dm.org/SnakeskinTpl/snakeskin-loader)
[![NPM devDependencies](http://img.shields.io/david/dev/SnakeskinTpl/snakeskin-loader.svg?style=flat)](https://david-dm.org/SnakeskinTpl/snakeskin-loader#info=devDependencies&view=table)
[![Build Status](http://img.shields.io/travis/SnakeskinTpl/snakeskin-loader.svg?style=flat&branch=master)](https://travis-ci.org/SnakeskinTpl/snakeskin-loader)

## Install

```bash
npm install snakeskin-loader --save-dev
```

## Usage

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
        loader: 'snakeskin-loader?localization=false'
      }
    ]
  }
}, function (err, stats) {
    // ...
});
```

## [Options](https://github.com/SnakeskinTpl/Snakeskin/wiki/compile)
## [License](https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE)

The MIT License.
