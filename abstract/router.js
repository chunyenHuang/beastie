const router = require('express').Router();
const fs = require('fs');
const path = require('path');

class AbstractRouter {
    constructor() {

    }
    loadRoutes(filePath, ignoreList) {
        filePath = filePath || __dirname;

        // Dynamically load all the routes in filePath
        fs
            .readdirSync(filePath)
            .filter((file) => {
                return file.charAt(0) !== '.';
            })
            .forEach((file) => {
                if (ignoreList && ignoreList.indexOf(file) >= 0) {
                    return;
                }

                const routePath = path.join(filePath, file);

                // If directory, then assume a new sub-router
                if (fs.statSync(routePath).isDirectory()) {

                    // Dyanimcally load router
                    const SubRouter = require(routePath);
                    const subRouter = new SubRouter();

                    // Map this folder as a router
                    server.app.use('/' + file, subRouter);

                    // Else, if file, then assume sub-route
                } else if ((file !== 'index.js') && (file.slice(-3) === '.js')) {
                    const SubRoute = require(routePath.slice(0, -3));
                    new SubRoute(router);
                }
            });
    }
}

module.exports = AbstractRouter;
