const Auth = require('express').Router();

Auth.use((req, res, next) => {
    if (req.cookies.beastieDeviceToken) {
        req.db.collection('devices')
            .find({
                beastieDeviceToken: req.cookies.beastieDeviceToken
            }).toArray((err, results) => {
                if (results.length > 0) {
                    req.currentDevice = results[0];
                    next();
                } else {
                    res.sendStatus(401);
                }
            });
    } else {
        res.sendStatus(401);
    }
});

module.exports = Auth;
