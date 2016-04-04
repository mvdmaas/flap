var path = require('path');

module.exports = {
  entry: path.resolve(path.join(__dirname, 'lib', 'index.js')),
  output: {
    path: path.resolve(path.join(__dirname, '.', 'dist')),
    library: 'collides',
    libraryTarget: 'umd',
    filename: 'collides.js'
  },
  module: {
    loaders: [{test: /\.js$/, loader: 'babel-loader'}]
  },

  resolve: {
    root: path.join(__dirname, 'lib'),
    extensions: ['', '.js', '.json'],
  },
};
