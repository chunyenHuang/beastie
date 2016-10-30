function getSessionToken(length) {
    let token = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var x = 0; x < length; x++) {
        token += possible.charAt(Math.floor(Math.random() * possible.length) + 1);
    }
    return token;
}

class UserAuthController {
    login(req, res) {
        req.collection.find({
            'loginId': req.body.loginId,
            'password': req.body.password
        }).toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    const newToken = getSessionToken(50);
                    const timeNow = new Date();
                    req.collection.update({
                        'loginId': req.body.loginId
                    }, {
                        $set: {
                            beastieUserToken: newToken,
                            lastLoginAt: timeNow
                        }
                    }, () => {
                        res.cookie('beastieUserToken', newToken);
                        res.json(Object.assign(results[0], {
                            beastieUserToken: newToken,
                            lastLoginAt: timeNow
                        }));
                    });
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.sendStatus(404);
            }
        });
    }

    logout(req, res) {
        req.collection.update({
            token: req.cookies.beastieUserToken
        }, {
            $set: {
                token: ''
            }
        }, (err) => {
            if (!err) {
                res.clearCookie('beastieUserToken');
                res.sendStatus(200);
            } else {
                res.sendStatus(403);
            }
        });
    }
}

module.exports = UserAuthController;
