/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    bookmarks: path.join(__dirname, 'src/bookmarks/index.tsx'),
    popup: path.join(__dirname, 'src/popup/index.tsx'),
    eventPage: path.join(__dirname, 'src/eventPage.ts'),
  },
});
