var path = require('path');
var webpack = require('webpack');
var src_dir = path.join(__dirname, 'Chrome', 'src');
var dist_dir = path.join(__dirname, 'Chrome', 'dist');

module.exports = {
  entry: {
    background: path.join(src_dir, 'background','index.js'),
    browser_action: path.join(src_dir,'browser_action','index.js'),
    content_scripts: path.join(src_dir,'content_scripts','index.js'),
    options_page: path.join(src_dir,'options_page','index.js'),
  output: {
    path: dist_dir,
    filename: "[name].js"
  },
  resolve: {
    alias: {
      Long: __dirname + "/node_modules/long/dist/Long.js",
      ByteBuffer: __dirname + "/node_modules/bytebuffer/dist/ByteBufferAB.js",
      "traceur-runtime": __dirname + "/node_modules/traceur/bin/traceur-runtime.js",
    }
  },
  module: {
    noParse: [
      /node_modules\/traceur\/bin/,
    ],
  },
};
