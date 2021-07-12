const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require("html-webpack-plugin");

const babel = require('./webpack/babel');
const css = require('./webpack/css');

const PATH = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
};

const rules = [babel(), css()];

module.exports = {
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    path: PATH.build,
    filename: 'bundle.[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
  },
  module: {
    rules,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      title: 'Конвертация валют',
    }),
  ],
};