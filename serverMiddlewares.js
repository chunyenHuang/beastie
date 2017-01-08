const path = require('path');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev.config');
config.entry.app = [
    'webpack-hot-middleware/client?reload=true',
    'babel-polyfill',
    path.join(__dirname, 'client/src/index.js')
];
const compiler = webpack(config);
const ServerMiddlewares = class ServerMiddlewares {
    constructor() {}
    transformRequest(req, res, next) {
        if (req.body) {
            const ObjectId = require('mongodb').ObjectID;
            for (let prop in req.body) {
                if (prop.indexOf('_id') > -1) {
                    req.body[prop] = ObjectId(req.body[prop]);
                }
                if (prop.search(/At$/) > -1) {
                    if (req.body[prop]) {
                        req.body[prop] = new Date(req.body[prop]);
                    }
                }
            }
        }
        if (req.query) {
            const ObjectId = require('mongodb').ObjectID;
            for (let prop in req.query) {
                if (prop.indexOf('_id') > -1) {
                    req.query[prop] = ObjectId(req.query[prop]);
                }
                if (prop.search(/At$/) > -1) {
                    if (req.body[prop]) {
                        req.body[prop] = new Date(req.body[prop]);
                    }
                }
            }
        }
        if (req.params) {
            const ObjectId = require('mongodb').ObjectID;
            for (let prop in req.params) {
                if (prop.indexOf('_id') > -1) {
                    req.params[prop] = ObjectId(req.params[prop]);
                }
            }
        }
        console.log(req.params);
        next();
    }

    get webpack() {
        const webpackMiddleware = webpackDevMiddleware(compiler, {
            // path: 'http://localhost:'+port,
            publicPath: config.output.publicPath,
            contentBase: path.join(__dirname, 'client/src/'),
            quiet: true,
            noInfo: true,
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        });

        return webpackMiddleware;
    }

    webpackHotMiddleware() {
        return webpackHotMiddleware(compiler, {
            log: () => {}
        });
    }
}

module.exports = new ServerMiddlewares();
