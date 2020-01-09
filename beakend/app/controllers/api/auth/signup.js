const md5 = require('md5');
const jwt = require('jsonwebtoken');
const sqlTable = require('../../../lib/sqlTable');
module.exports = (backendApp, router) => {

    const getToken = login =>{
        return jwt.sign({login: login}, backendApp.config.jwtSecret);
    };

    const signup = (req,res,next) => {
        if (!req.body.cName) return res.badRequest('Name require');
        if (!req.body.login) return res.badRequest('Login require');
        if (!req.body.password) return res.badRequest('Password require');
        if (req.body.login && req.body.login.length<3) return res.badRequest('To short login');
        if (req.body.password && req.body.password.length<3) return res.badRequest('To short password');
        const Client = sqlTable.table('Client');
        const login = req.body.login.toLowerCase();
        const findUser = () => {
            Client.findOne({login: login}, (err, user) => {
                if (err && err.code === 'ER_NO_SUCH_TABLE') {
                    return findUser();
                }
                if (err) return res.serverError(err);
                if (user) return res.notFound("User with this login created");
                if (!user){
                    req.body.token = getToken(req.body.login);
                    req.body.password = md5(req.body.password);
                    const createUser = () =>{
                        Client.create(req.body, (e,r)=>{
                            if (e && e.code === 'ER_NO_SUCH_TABLE') {
                                return createUser();
                            }
                            if (e) return res.serverError(e);
                            if (!r) return res.badRequest({});

                            res.cookie('token',String(req.body.token),
                                {
                                    domain: backendApp.config.site.sidDomain,
                                    path:"/",
                                    httpOnly: true
                                });
                            res.cookie('userId', String(r.insertId),
                                {
                                    domain: backendApp.config.site.sidDomain,
                                    path:"/",
                                    httpOnly: false
                                });
                            delete req.body.password;
                            res.ok({token:req.body.token, userId:r.insertId, user: req.body});
                            return;
                        })
                    };
                    createUser()
                }
                return;
            });
        };
        findUser();
    };

    router.post('/signup', [], signup);
};

