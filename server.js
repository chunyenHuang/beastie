/*
    Modules
*/
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
const CronJob = require('cron').CronJob;
const multer = require('multer');

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
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.set('socket-io', io);
app.set('port', port);

/*
    const io = req.app.get('socket-io');
    io.sockets.emit('socket-name', {
        message: 'something',
        data: data
        ....
    });
*/

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
    if(!DB){
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
function transformRequestMiddleware(req, res, next){
    if(req.body){
        const ObjectId = require('mongodb').ObjectID;
        for(let prop in req.body){
            if(prop.indexOf('_id')>-1){
                req.body[prop] = ObjectId(req.body[prop]);
            }
            if(prop.search(/At$/)>-1){
                if(req.body[prop]){
                    req.body[prop] = new Date(req.body[prop]);
                }
            }
        }
    }
    if(req.query){
        const ObjectId = require('mongodb').ObjectID;
        for(let prop in req.query){
            if(prop.indexOf('_id')>-1){
                req.query[prop] = ObjectId(req.query[prop]);
            }
            if(prop.search(/At$/)>-1){
                if(req.body[prop]){
                    req.body[prop] = new Date(req.body[prop]);
                }
            }
        }
    }
    if(req.params){
        const ObjectId = require('mongodb').ObjectID;
        for(let prop in req.params){
            if(prop.indexOf('_id')>-1){
                req.params[prop] = ObjectId(req.params[prop]);
            }
        }
    }
    next();
}

app.use(transformRequestMiddleware);

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


/*
    Routes
*/

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

/*
 * Schedule Backup
 * '* * * * * *'
 * You will see this message every second
 *
 * '00 30 11 * * 1-5'
 * Runs every weekday (Monday through Friday)
 * at 11:30:00 AM. It does not run on Saturday
 * or Sunday.
 */

const backupTime = [
    '00 00 10 * * 0-7',
    '00 00 12 * * 0-7',
    '00 00 14 * * 0-7',
    '00 00 18 * * 0-7',
    '00 00 20 * * 0-7'
];

for (var i = 0; i < backupTime.length; i++) {
    const job = new CronJob({
        cronTime: backupTime[i],
        onTick: () => {
            const Backup = require('./scripts/backup');
            const today = new Date();
            console.log('----------------------------')
            console.log(today);
            console.log('----------------------------')
            Backup();
        },
        start: false,
        timeZone: 'America/Los_Angeles'
    });
    job.start();
}

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
