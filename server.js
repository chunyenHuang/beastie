// Modules
const express = require('express');
const compression = require('compression');
const mongodb = require('mongodb');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.load({
    path: '.env.file'
});
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads');
    },
    filename: (req, file, callback) => {
        const newName = file.fieldname + '-' + Date.now();
        callback(
            null,
            newName
        );
    }
});
const upload = multer({
    storage: storage
}).single('file');

// global path
global.uploads = path.join(__dirname, 'uploads');
global.images = path.join(__dirname, 'images');

// Setup Express Server
const port = process.env.PORT || 3000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
/*
    const io = req.app.get('socket-io');
    io.sockets.emit('socket-name', {
        message: 'something',
        data: data
        ....
    });
*/
app.set('socket-io', io);
app.set('port', port);
const accessLogStream = fs.createWriteStream(__dirname + '/server.log', {
    flags: 'a'
});
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev') {
    app.use(logger('dev'));
} else {
    app.use(logger('combined', {
        'stream': accessLogStream
    }));
}
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(upload);
app.use(expressValidator());

const dbClient = mongodb.MongoClient;
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
        path.join(__dirname, 'client/src/index.js')
    ];
    const compiler = webpack(config);
    // compiler.apply(new DashboardPlugin(dashboard.setData));
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
    app.use(webpackMiddleware);
    app.use(webpackHotMiddleware(compiler, {
        log: () => {}
    }));
} else {
    app.use(express.static(path.join(__dirname, 'dist'), {
        maxAge: 31557600000
    }));
}

app.get('/*', (req, res, next) => {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

// Auths
const authRoutes = path.join(__dirname, '/routes/auths');
fs.readdirSync(authRoutes).forEach((file) => {
    const route = path.join(authRoutes, file);
    require(route)(app);
});

// Middlewares
// app.use(require('./routes/middlewares/userAuth'));

// Resources
const routes = path.join(__dirname, '/routes/resources');
fs.readdirSync(routes).forEach((file) => {
    if (file != '.DS_Store') {
        const route = path.join(routes, file);
        require(route)(app);
    }
});

// Errors
app.use(errorHandler());

// Start Server
// app.listen(app.get('port'), () => {
//     let mode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production';
//     console.log('Listening on port %d in %s mode', app.get('port'), mode);
// });
server.listen(app.get('port'), () => {
    let mode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production';
    console.log('Listening on port %d in %s mode', app.get('port'), mode);
});

// Running w/ https
// const http = require('http');
// const https = require('https');
// const sslport = parseInt(port) + 1;
// https
//     .createServer({
//         key: fs.readFileSync('./ssl/server.key'),
//         cert: fs.readFileSync('./ssl/server.crt')
//     }, app)
//     .listen(sslport, () => {
//         // eslint-disable-next-line no-console
//         console.log('Running HTTPS on port ' + sslport);
//     });

// http
//     .createServer(
//         (request, response) => {
//             const correctedHost = request.headers['host'].replace(port, sslport);
//             const httpsURI = correctedHost + request.url;
//             // eslint-disable-next-line no-console
//             console.log('Redirecting to: ' + httpsURI);
//             response.writeHead(301, {
//                 Location: 'https://' + httpsURI
//             });
//             response.end();
//         }
//     )
//     .listen(port, () => {
//         // eslint-disable-next-line no-console
//         console.log('Running HTTP on port ' + port);
//     });


module.exports = app;
