const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');

config.devtool = 'eval';
// config.devtool = 'eval-cheap-module-source-map';
config.output = {
    filename: '[name].bundle.js',
    publicPath: '/',
    path: path.join(__dirname, './client/src')
};

config.plugins = config.plugins
    .concat([
        new webpack.OldWatchingPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]);

module.exports = config;
