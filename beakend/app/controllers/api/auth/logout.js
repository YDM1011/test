const md5 = require('md5');
const jwt = require('jsonwebtoken');
module.exports = (backendApp, router) => {

    const logout = (req, res, next) => {
        res.cookie('token',this.token,
            {
                domain: backendApp.config.site.sidDomain,
                path:"/",
                expires: new Date(-1),
                httpOnly: true
            });
        res.cookie('userId', String(this._id),
            {
                domain: backendApp.config.site.sidDomain,
                path:"/",
                expires: new Date(-1),
                httpOnly: false
            });
        res.ok({mes:'ok'})
    };

    router.post('/logout', [], logout);
};

