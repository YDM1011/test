const md5 = require('md5');
module.exports = (backendApp, router) => {
    const sqlTable = require('../../../lib/sqlTable');
    const signin = (req,res,next) => {
        if (!req.body.login) return res.badRequest('Login require');
        if (!req.body.password) return res.badRequest('Password require');
        if (req.body.login && req.body.login.length<3) return res.badRequest('To short login');
        if (req.body.password && req.body.password.length<3) return res.badRequest('To short password');
        const Client = sqlTable.table('Client');
        const login = req.body.login.toLowerCase();
        Client.findOne({login: login, password: md5(req.body.password)}, (err, r) => {
            if (err) return res.serverError(err);
            if (!r) return res.notFound("Not valid login or password");
            if (r){
                res.cookie('token',String(r.token),
                    {
                        domain: backendApp.config.site.sidDomain,
                        path:"/",
                        httpOnly: true
                    });
                res.cookie('userId', String(r.cID),
                    {
                        domain: backendApp.config.site.sidDomain,
                        path:"/",
                        httpOnly: false
                    });
                delete r.password;
                res.ok({token:r.token, userId:r.cID, user: r});
            }
        });
    };

    router.post('/signin', [], signin);
};
