const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.join(__dirname, '/src/reactjs/main.jsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/src/dist')
  },
  
  devServer: {
    contentBase: './dist',
  }
};