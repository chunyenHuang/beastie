const Auth = require('express').Router();

Auth.use((req, res, next) => {
    next();
});

module.exports = Auth;
