var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var src_dir = path.join(__dirname, 'Chrome', 'src');
var dist_dir = path.join(__dirname, 'Chrome', 'dist');

module.exports = {
  entry: {
    background: path.join(src_dir, 'background','index.js'),
    browser_action: path.join(src_dir,'browser_action','index.js'),
    content_scripts: path.join(src_dir,'content_scripts','index.js'),
    options_page: path.join(src_dir,'options_page','index.js'),
  },
  output: {
    path: dist_dir,
    filename: "[name].js"
  },
  resolve: {
    alias: {
      Long: __dirname + "/node_modules/long/dist/Long.js",
      ByteBuffer: __dirname + "/node_modules/bytebuffer/dist/ByteBufferAB.js",
      "traceur-runtime": __dirname + "/node_modules/traceur/bin/traceur-runtime.js",
      crypto: __dirname + "/node_modules/crypto-browserify/index.js"
    }
  },
  module: {
    loaders: [
      { test: /\.css$/,      loader: "style-loader!css-loader" },
      { test: /\.gif$/,      loader: "url-loader?limit=100000&minetype=image/gif" },
      { test: /\.png$/,      loader: "url-loader?limit=100000&minetype=image/png" },
      { test: /\.json$/,     loader: "json-loader" },
      { test: /\.babel.js$/, loader: "babel-loader" },
      { test: /\.jsx$/, loader: "babel-loader",
        query:{presets:['react']}
      }
    ],
    noParse: [
      /node_modules\/traceur\/bin/,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'browser_action.html',
      template: path.join(src_dir,'browser_action','index.html'),
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'options_page.html',
      template: path.join(src_dir,'options_page','index.html'),
      inject: false,
    }),
  ],

};
