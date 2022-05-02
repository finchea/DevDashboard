const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const fs = require('fs');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist',
    disableHostCheck: true, // questionable
    port: 9000,
    hot: true,
    open: true,
    publicPath: '/',
    setup: function (app) {
      app.get('/VERSION', function (req, res) {
        fs.readFile('deployer/VERSION', 'utf8', function (err, data) {
          if (err) {
            res.send(err);
          }
          res.send(data);
        });
      });
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/' }
      ]
    }
  },  
});
