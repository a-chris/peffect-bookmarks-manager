/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    bookmarks: path.join(__dirname, 'src/bookmarks/index.tsx'),
    dev_bookmarks: path.join(__dirname, 'src/bookmarks/dev_index.tsx'),
    popup: path.join(__dirname, 'src/popup/index.tsx'),
    eventPage: path.join(__dirname, 'src/eventPage.ts'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    // hot: true,
    port: 5000,
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
});
