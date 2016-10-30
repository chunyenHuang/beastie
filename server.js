// Modules
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongodb = require('mongodb');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
dotenv.load({
    path: '.env.file'
});

// Setup Express Server
const port = process.env.PORT || 3000;
const app = express();
app.set('port', port);
app.use(compression());
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());

// MongoDB
// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//     store: new MongoStore({
//         url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
//         autoReconnect: true
//     })
// }));

const dbClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;

app.use((req, res, next) => {
    dbClient.connect(dbUrl, (err, db) => {
        req.db = db;
        next();
    });
});

if (process.env.NODE_ENV == 'development') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('./webpack.dev.config');
    config.entry.app = [
        'webpack-hot-middleware/client?reload=true',
        'babel-polyfill',
        path.join(__dirname, './client/src/index.js'),
    ];
    const compiler = webpack(config);
    // compiler.apply(new DashboardPlugin(dashboard.setData));
    const webpackMiddleware = webpackDevMiddleware(compiler, {
        // path: 'http://localhost:'+port,
        publicPath: config.output.publicPath,
        contentBase: path.join(__dirname, './client/src/'),
        quiet: true,
        noInfo: true,
        headers: {
            'X-Custom-Header': 'yes'
        },
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });
    app.use(webpackMiddleware);
    app.use(webpackHotMiddleware(compiler, {
        log: () => {}
    }));
} else {
    app.use(express.static(path.join(__dirname, 'dist'), {
        maxAge: 31557600000
    }));
}

// Middlewares
app.use(require('./middlewares/auth'));

// Load Routes
const routePath = path.join(__dirname, '/routes');
fs.readdirSync(routePath).forEach((file) => {
    // console.log(file);
    const route = path.join(routePath, file);
    // require(route)(app);
    // app.use('/'+file, require(route));
    require(route)(app);
});

// Errors
app.use(errorHandler());

// Start Server
app.listen(app.get('port'), () => {
    let mode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production';
    console.log('Listening on port %d in %s mode', app.get('port'), mode);
});

module.exports = app;
