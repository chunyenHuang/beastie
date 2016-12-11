const routes = (serverApp) => {
    const path = require('path');
    const fs = require('fs');
    const routeRootPath = path.join(__dirname);


    serverApp.get('/*', (req, res, next) => {
        res.setHeader('Last-Modified', (new Date()).toUTCString());
        next();
    });

    console.log('=== Routes ===');
    // Auths
    const authRoutes = path.join(routeRootPath, 'auths');
    fs
        .readdirSync(authRoutes)
        .filter((file) => {
            return file.charAt(0) !== '.';
        })
        .forEach((file) => {
            const route = path.join(authRoutes, file);
            require(route)(serverApp);
            console.log('route: ' + file);
        });

    // Middlewares
    // serverApp.use(require('./routes/middlewares/userAuth'));

    // Resources
    const routes = path.join(routeRootPath, 'resources');
    fs
        .readdirSync(routes)
        .filter((file) => {
            return file.charAt(0) !== '.';
        })
        .forEach((file) => {
            if (!process.env.CLOUD9) {
                const route = path.join(routes, file);
                console.log('route: ' + file);
                require(route)(serverApp);
            } else if (
                file != 'printer' &&
                file != 'inhouseOrders'
            ) {
                const route = path.join(routes, file);
                console.log('route: ' + file);
                require(route)(serverApp);
            }
        });
};

module.exports = routes;
