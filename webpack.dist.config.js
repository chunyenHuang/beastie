const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const config = require('./webpack.config');

config.entry = {
    'app': [
        'babel-polyfill',
        path.join(__dirname, 'client/src/index.js')
    ]
};

config.debug = false;
config.devtool = 'source-map';
config.output = {
    filename: '[name].bundle.js',
    publicPath: '',
    path: path.join(__dirname, 'dist')
};

config.plugins = config.plugins.concat([
  // Reduces bundles total size
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
            screw_ie8: true,
            keep_fnames: true,
            except: ['$super', '$', 'exports', 'require', 'angular']
        },
        compress: {
            screw_ie8: true,
            unused: true,
            dead_code: true
        },
        comments: false
    }),
    new CompressionPlugin({
        regExp: /\.css$|\.html$|\.js$|\.map$/,
        threshold: 2 * 1024
    })

]);

module.exports = config;
