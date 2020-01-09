const express = require('express');
const glob = require('glob');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const jwt = require('jwt-express');
const flash = require('connect-flash');
const path = require('path');

const init = (app, config) =>{

    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb', "strict": false,}));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
    app.use(cookieParser());
    app.use(compress());
    app.use(flash());
    // app.use('/upload', express.static(path.join(__dirname, '../../upload')));
    // app.use('/', express.static(path.join(__dirname, '../../public')));
    // app.use('/', express.static(path.join(__dirname, '../../../admin/dist/admin')));
    // app.use('/', express.static(path.join(__dirname, '../../../aplication/dist/application')));
    //
    // app.use('/', express.static(path.join(__dirname, '../../../provider/dist/provider')));

    app.use(methodOverride());
    app.use(jwt.init(config.jwtSecret, {
        cookies: true
    }));
    // app.set('subdomain offset', 1);

    app.use((req, res, next) => {
        /** Params for cookie auth form angular 7 */
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', req.headers.origin || config.site.domain || '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, WS, Cookies, Cookie, Set-Cookie, Content-Length, PortalRequest, X-Requested-With');
        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {
            res.send();
        } else {
            next();
        }
    });
    app.use(require("../../app/responces"));
    // const events = require('events');
    let backendApp = {
        app: app,
        config: config,
        express: express
    };
    global.backendApp = backendApp;
    backendApp.middlewares = require('../middlewares')(backendApp, config);
    // backendApp.hooks = require('../hooks')(backendApp, config);
    // new backendApp.hooks.transfer();
    require('./mysqlRestApi')(backendApp);
    require('../controllers')(backendApp);
    // require('../service')(backendApp);


    app.set('views', path.join(__dirname, '../../../beakend/views'));
    app.set('view engine', 'ejs');


// catch 404 and forward to error handler
    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // console.log('subdomains',req.subdomains);
        // if (req.subdomains.length === 0 && err.status === 404) {
        //     res.status(200);
        //     res.render('index');
        //     return
        // }
        if(err.status == 404) {
            res.status(404);
            res.render('404');
        } else {
            res.status(err.status || 500);
            res.render('error', {error: err});
        }
        // render the error page
    });
    // require('../cron/task');
    return app;
};


module.exports = init;
