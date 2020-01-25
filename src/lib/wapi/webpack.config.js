const path = require('path');

module.exports = {
  entry: './wapi.js',
  output: {
    path: path.resolve(__dirname, '../../../dist/lib/wapi'),
    filename: 'wapi.js'
  }
};