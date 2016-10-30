const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const METADATA = require('./client/src/METADATA.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    debug: true,
    // postcss: () => [autoprefixer],
    entry: {},
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/app\/lib/, /node_modules/],
                loader: 'ng-annotate!babel'
            }, {
                test: /\.html$/,
                loader: 'raw'
            }, {
                test: /\.styl$/,
                loader: 'style!css!stylus'
            }, {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ],
        noParse: []
    },
    resolve: {
        root: [],
        modulesDirectories: ['node_modules'],
        alias: {
            'variable': path.join(__dirname, './client/src/index.variable.styl'),
            'client': path.join(__dirname, './client')
        },
        extensions: ['', '.js']
    },
    plugins: [
        new ProgressBarPlugin(),
        new webpack.NoErrorsPlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: (module, count) => { // min entries shared >=2
        //         return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) === -1;
        //     }
        // }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'client/src/assets'),
                to: 'assets'
            }
        ]),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'client/src/index.tpl.ejs'),
            inject: 'body',
            hash: true,
            title: METADATA.webTitle,
            author: METADATA.webAuthor,
            description: METADATA.webDescription,
            baseUrl: METADATA.baseUrl,
            iconUrl: METADATA.iconUrl
        })
    ]
};
