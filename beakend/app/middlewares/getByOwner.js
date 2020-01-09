// const mongoose = require('mongoose');
//
module.exports = (req, res, next) => {
    const sqlTable = require('../lib/sqlTable');
    const config = require('../config/config');
    const jwt = require('jsonwebtoken');
    const protect = req.cookies['token'] || req.jwt.token || req.headers.authorization;
    const connect = protect.split(" ");
    jwt.verify(connect[0], config.jwtSecret, (err,data)=>{
        if (err) return res.serverError("Token error");
        sqlTable.table('Client').findOne({login: data.login }, (err, info)=>{
            if (err) return res.serverError(err);
            if (!info) return res.forbidden("Forbidden");
            delete info.password;
            req.user = info;
            next()
        });
    });

};