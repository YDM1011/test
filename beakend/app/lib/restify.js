const mysql = require('mysql');
const sqlTable = require('./sqlTable');
module.exports = (router, table, option) =>{
    const uri = `${option.prefix}/${table}/:id?`;
    const restifyRead   = (req,res,next) => {
        let isObj = false;
        const db = mysql.createConnection(backendApp.config.db);
        db.connect();
        let sql = ` SELECT * FROM ${table} ${table}`;
        let schems = sqlTable.schema();
        if (req.query && req.query.join){

            let join = req.query.join;
            try {
                 join = JSON.parse(req.query.join);
            } catch (e) { }

            if (typeof join === 'object' && join.length>0) {
                join.forEach(path=>{
                    sql += ` LEFT JOIN ${schems[table][path].join} ${schems[table][path].join}
                    ON ${table}.${path} = ${schems[table][path].join}.${schems[table][path].joinId}`
                });
            }
            if (typeof join === 'string'){
                const path = String(req.query.join).replace('"','').replace('"','');
                sql += ` LEFT JOIN ${schems[table][path].join} ${schems[table][path].join}
                 ON ${table}.${path} = ${schems[table][path].join}.${schems[table][path].joinId}`
            }
        }
        if (req.params.id && (!req.query.like || req.params.id === 'count')) {
            isObj = true;
            let keyWord = 'WHERE';
            if (sql.search(keyWord) > -1) keyWord = 'AND';
            if (req.params.id === 'count') {
                sql = sql.replace('*','COUNT(*)');

            } else {
                sql += ` ${keyWord} ${option.idProperty} = ${req.params.id}`
            }
        } else if (req.params.id && req.query.like && (req.params.id !== 'count')) {
            req.error = {error:`can't be params ID with like`};
            db.end();
            return next()
        }
        if (req.query && req.query.like){
            let like = JSON.parse(req.query.like);
            let keyWord = 'WHERE';
            if (sql.search(keyWord) > -1) keyWord = 'AND';
            for (key in like) {
                sql += ` ${keyWord} ${key} LIKE '${like[key]}%'`
            }
        }
        if (schems[table].$options && schems[table].$options.getByOwner) {
            let keyWord = 'WHERE';
            if (sql.search(keyWord) > -1) keyWord = 'AND';
            sql += ` ${keyWord} ${table}.${schems[table].$options.getByOwner} = ${req.user[schems['client'].$id]}`
        }

        if (req.query && req.query.limit && !req.query.skip){
            sql += ` LIMIT ${String(req.query.limit)}`
        }
        if (req.query && req.query.limit && req.query.skip){
            sql += ` LIMIT ${String(req.query.skip)}, ${String(req.query.limit)}`
        }
        db.query(sql,
            (e,r)=>{
                if (r) {
                    r = JSON.parse(JSON.stringify(r));
                    r.forEach((item, i)=>{
                        delete item.password;
                        delete item.token;
                        r[i] = item;
                    })
                }
                if (isObj) r = r ? r[0] || {} : {};
                if (e && e.code === 'ER_NO_SUCH_TABLE') {
                    require('../tables/'+table)(table);
                    if (isObj) return res.ok({});
                    return res.ok([])
                }
                req.erm = r;
                next()
            });
        db.end();
    };
    const restifyCreate = (req,res,next) => {
        if (!req.body) return res.badRequest('can`t create');
        let schemClient = sqlTable.schema()['client'];
        let schem = sqlTable.schema()[table];
        let isValidBody = false;
        const db = mysql.createConnection(backendApp.config.db);
        db.connect();
        let sql = `INSERT INTO ${table} (`;
        req.erm = {};
        if (schem.$options && schem.$options.getByOwner)
            req.body[schem.$options.getByOwner] = req.user[schemClient.$id];
        for (key in schem) {
            if (key !== '$id' && key != 'PRIMARY KEY' &&
                (req.body[key] || req.body[key] === 0)) {
                isValidBody = true;
                sql += `${key}, `;
                req.erm[key] = req.body[key];
            }
        }
        if (!isValidBody){
            req.error = {error:`request body invalid`};
            db.end();
            return next()
        }

        sql = sql.slice(', ',-2) + ') VALUES (';
        for (key in schem) {
            if (key !== '$id' && key != 'PRIMARY KEY' &&
                (req.body[key] || req.body[key] === 0))
                sql += `'${req.body[key]}', `
        }
        sql = sql.slice(', ',-2) + ')';
        console.log(sql);
        db.query(sql, (e,r)=>{
            if (e && e.code === 'ER_NO_SUCH_TABLE') {
                // db.end();
                require('../tables/'+table)(table);
                return res.ok({});
            }
            req.erm[schem.$id] = r.insertId;
            next()
        });
        db.end()
    };
    const restifyUpdate = (req,res,next) => {
        if (!req.body) return res.badRequest('can`t create');
        let schemClient = sqlTable.schema()['client'];
        let schem = sqlTable.schema()[table];
        let isValidBody = false;
        const db = mysql.createConnection(backendApp.config.db);
        db.connect();
        let sql = `UPDATE ${table} SET `;
        req.erm = {};
        for (key in schem) {
            if (key !== '$id' && key != 'PRIMARY KEY' &&
                (req.body[key] || req.body[key] === 0)) {
                        isValidBody = true;
                        sql += `${key} = '${req.body[key]}', `;
                        req.erm[key] = req.body[key];
                    }
        }
        if (!isValidBody){
            req.error = {error:`request body invalid`};
            db.end();
            return next()
        }
        sql = sql.slice(', ',-2) + ' WHERE '+schem.$id+' = '+req.params.id ;
        if (schem.$options && schem.$options.getByOwner){
            sql += ` AND ${schem.$options.getByOwner} = ${req.user[schemClient.$id]}`
        }

        db.query(sql, (e,r)=>{
            if (e && e.code === 'ER_NO_SUCH_TABLE') {
                // db.end();
                require('../tables/'+table)(table);
                return res.ok({});
            }
            if (r && r.changedRows > 0) {
                req.erm[schem.$id] = req.params.id;
                next()
            } else {
                let query = {};
                query[schem.$options.getByOwner] = req.user[schemClient.$id];
                query[schem.$id] = req.params.id;
                sqlTable.table(table).findOne(query, (e,obj)=>{
                    if (e) {
                        req.error = e;
                        return next()
                    }
                    if (!obj) {
                        return res.forbidden("Forbidden!")
                    }
                    req.erm = obj;
                    next()
                });
            }

        });
        db.end()
    };
    const restifyDelete = (req,res,next) => {
        let schem = sqlTable.schema()[table];
        let schemClient = sqlTable.schema()['client'];
        const db = mysql.createConnection(backendApp.config.db);
        db.connect();
        let sql = `DELETE FROM ${table}`;
        if (req.params.id) {
            sql += ` WHERE ${schem.$id} = ${req.params.id}`;
            if (schem.$options && schem.$options.getByOwner){
                req.body[schem.$options.getByOwner] = req.user[schemClient.$id];
                sql += ` AND ${schem.$options.getByOwner} = ${req.user[schemClient.$id]}`
            }
        } else if (schem.$options && schem.$options.getByOwner) {
            req.body[schem.$options.getByOwner] = req.user[schemClient.$id];
            sql += ` WHERE ${schem.$options.getByOwner} = ${req.user[schemClient.$id]}`
        }
        db.query(sql, (e,r)=>{
            if (e && e.code === 'ER_NO_SUCH_TABLE') {
                return res.ok({});
            }
            if (r && r.changedRows > 0) {
                req.erm = r;
                next()
            } else {
                let query = {};
                query[schem.$id] = req.params.id;
                sqlTable.table(table).findOne(query, (e,obj)=>{
                    if (e) {
                        req.error = e;
                        return next()
                    }
                    if (obj && obj[schem.$options.getByOwner] !== req.user[schemClient.$id]) {
                        return res.forbidden("Forbidden!")
                    }
                    req.erm = r;
                    next()
                });
            }
        });
        db.end()
    };
    const preRestify = (req,res,next) => {
        req['erm'] = {table: table};
        next()
    };
    router.get(uri, [preRestify, option.preRead || [], restifyRead, option.postRead || []], (req,res,next)=>{
        if (req.error) return res.badRequest(req.error);
        res.ok(req.erm)
    });
    router.post(`${option.prefix}/${table}`, [preRestify, option.preCreate || [], restifyCreate, option.postCreate || []], (req,res,next)=>{
            res.ok(req.erm)
        });
    router.post(`${option.prefix}/${table}/:id`, [preRestify, option.preUpdate || [], restifyUpdate, option.postUpdate || []], (req,res,next)=>{
        res.ok(req.erm)
    });
    router.delete(`${option.prefix}/${table}/:id?`, [preRestify, option.preDelete || [], restifyDelete, option.postDelete || []], (req,res,next)=>{
        res.ok(req.erm)
    })
};