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
const multer = require('multer');
const colors = require('colors');

const ServerMiddlewares = require('./serverMiddlewares');
/*
    Configuration
*/
dotenv.load({
    path: '.env.file'
});
const port = process.env.PORT || 3000;
const dbClient = mongodb.MongoClient;
var DB;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './files/uploads');
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

/*
    global
*/

global.root = path.join(__dirname);
global.uploads = path.join(__dirname, 'files/uploads');
global.images = path.join(__dirname, 'files/images');

/*
    Setup Express Server
*/

const app = express();
const http = require('http');
const https = require('https');
const sslport = parseInt(port) + 1;
let server;
let serverHttps;
let io;
if (process.env.CLOUD9) {
    server = http.Server(app);
    io = require('socket.io')(server);
} else {
    server = http.createServer((request, response) => {
        const correctedHost = request.headers['host'].replace(port, sslport);
        const httpsURI = correctedHost + request.url;
        // eslint-disable-next-line no-console
        console.log('Redirecting to: ' + httpsURI);
        response.writeHead(301, {
            Location: 'https://' + httpsURI
        });
        response.end();
    });

    serverHttps = https.createServer({
        key: fs.readFileSync('./ssl/server.key'),
        cert: fs.readFileSync('./ssl/server.crt')
    }, app);

    io = require('socket.io')(serverHttps);
}
app.set('socket-io', io);
app.set('port', port);

/*
    Express Configuration
*/
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev') {
    app.use(logger('dev'));
} else {
    const accessLogStream = fs.createWriteStream(__dirname + '/server.log', {
        flags: 'a'
    });
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
app.use((req, res, next) => {
    if (!DB) {
        dbClient.connect(dbUrl, (err, db) => {
            DB = db;
            req.db = db;
            next();
        });
    } else {
        req.db = DB;
        next();
    }
});
app.use(ServerMiddlewares.transformRequest);

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
/*
    static images/ files
*/
app.use(express.static(path.join(__dirname, 'files'), {
    maxAge: 31557600000
}));


// load modules
const routes = require('./routes');
routes(app);

// load modules
const modules = require('./modules');
modules(app);

// Errors
app.use(errorHandler());

// Start Server
// app.listen(app.get('port'), () => {
//     let mode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production';
//     console.log('Listening on port %d in %s mode', app.get('port'), mode);
// });
if (process.env.CLOUD9) {
    server.listen(app.get('port'), () => {
        let mode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production';
        console.log(mode.green);
        require('dns').lookup(require('os').hostname(), (err, add, fam) => {
            console.log((add + ':' + app.get('port')).yellow);
        });
        // console.log(server.address().address );
    });
} else {
    server.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log('Running HTTP on port ' + port);
    });
    serverHttps.listen(sslport, () => {
        // eslint-disable-next-line no-console
        let mode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'production';
        console.log(mode.green);
        require('dns').lookup(require('os').hostname(), (err, add, fam) => {
            console.log(('https://' + add + ':' + sslport).yellow);
        });
    });
}
module.exports = app;
