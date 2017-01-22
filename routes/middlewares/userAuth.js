const Auth = require('express').Router();

Auth.use((req, res, next) => {
    if (req.cookies.beastieUserToken) {
        req.db.collection('users')
            .find({
                // role: 'admin',
                beastieUserToken: req.cookies.beastieUserToken
            }).toArray((err, results) => {
                if (results.length > 0) {
                    req.currentUser = results[0];
                    next();
                } else {
                    const io = req.app.get('socket-io');
                    io.sockets.emit('reLogin', {
                        msg: 'request login.'
                    });
                    res.sendStatus(401);
                }
            });
    } else {
        const io = req.app.get('socket-io');
        io.sockets.emit('reLogin', {
            msg: 'request login.'
        });
        res.sendStatus(401);
    }
});

module.exports = Auth;
