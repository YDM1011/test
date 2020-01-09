let dbOption;
const tables = [];
const schems = {};
// const globglob = require('glob');
const mysql = require('mysql');
module.exports.conection = (option = dbOption, cb) => {
    dbOption = option;
    let db = mysql.createConnection(
        {
            host: option.host,
            user: option.user,
            password: option.password
        });
    db['createDB'] = (name, cb) => {
        const sql = `CREATE DATABASE IF NOT EXISTS ${name}`;
        db.query(sql, (err, result)=>{
            if (err) return cb(err);
            if (result) return cb(null, result);
            return process.exit(1);
        })
    };
    db.connect(err=>{
    if (err) throw err;
    try {
        db.createDB(option.database, (errDB, result)=>{
            db.end();
        })
    } catch(e){console.log(e)}
});
};
module.exports.model = (table, schema) => {
    /** create and declarate table **/
    table = table.toLowerCase();
    tables.push({
        tableName: table,
        tableId: schema.$id,
        options: schema.$options || {}
    });
    schems[table] = schema;
    let db = mysql.createConnection(dbOption);
    db.connect(err=>{
        if (err) throw err;
        let sql = `CREATE TABLE IF NOT EXISTS ${table}(`;
        for (key in schema) {
            if (typeof schema[key] === 'string'){
                if (key !== '$id')
                    if (key !== '$options')
                        sql += `${key} ${schema[key]}, `
            } else if (typeof schema[key].type === 'string'){
                if (key !== '$id')
                    if (key !== '$options')
                        sql += `${key} ${schema[key].type}, `
            }

        }
        sql = sql.slice(', ',-2) + ')';

        db.query(sql, (e,r)=>{  });
        db.end()
    });

};
module.exports.tables = () => {
    return tables;
};
module.exports.schema = () => {
    return schems;
};
module.exports.table = (Name) => {
    let name = Name.toLowerCase();
    return {
        findOne: (obj, cb) => {
            const db = mysql.createConnection(dbOption);
            db.connect();
            try {
                let sql = `SELECT * FROM ${name}`;
                let keyWord = 'WHERE';
                for (key in obj) {
                    if (sql.search(keyWord) > -1) keyWord = 'AND';
                    sql += ` ${keyWord} ${key} = '${obj[key]}'`
                }
                db.query(sql, (e,r)=>{
                    if (e && e.code === 'ER_NO_SUCH_TABLE') {
                        db.end();
                        require('../tables/'+Name)(Name);
                        this.table().findOne(obj,cb)
                    }
                    if (e && e.code === 'ER_BAD_DB_ERROR') {
                        this.conection();
                        this.table().findOne(obj,cb)
                    }
                    if (r && r[0]){
                        r = JSON.stringify(r[0]);
                        r = JSON.parse(r);
                    } else r = null;
                    cb(e,r)
                });
            } catch (e) {
                db.end();
                return cb(e,null)
            }
            db.end()
        },
        find: (obj, cb) => {
            const db = mysql.createConnection(dbOption);
            db.connect();
            try {
                let sql = `SELECT * FROM ${name}`;
                let keyWord = 'WHERE';
                for (key in obj) {
                    if (sql.search(keyWord) > -1) keyWord = 'AND';
                    sql += ` ${keyWord} ${key} = ${obj[key]}`
                }
                db.query(sql, (e,r)=>{
                    if (e && e.code === 'ER_NO_SUCH_TABLE') {
                        db.end();
                        require('../tables/'+Name)(Name);
                        this.table().find(obj,cb)
                    }
                    if (e && e.code === 'ER_BAD_DB_ERROR') {
                        this.conection();
                        this.table().find(obj,cb)
                    }
                    cb(e,r)
                });
            } catch (e) {
                db.end();
                return cb(e,null)
            }
            db.end()
        },
        findCount: (obj, cb) => {
            const db = mysql.createConnection(dbOption);
            db.connect();
            try {
                let sql = `SELECT COUNT(*) FROM ${name}`;
                let keyWord = 'WHERE';
                for (key in obj) {
                    if (sql.search(keyWord) > -1) keyWord = 'AND';
                    sql += ` ${keyWord} ${key} = ${obj[key]}`
                }
                console.log(sql)
                db.query(sql, (e,r)=>{
                    if (e && e.code === 'ER_NO_SUCH_TABLE') {
                        db.end();
                        require('../tables/'+Name)(Name);
                        this.table().findCount(obj,cb)
                    }
                    if (e && e.code === 'ER_BAD_DB_ERROR') {
                        this.conection();
                        this.table().findCount(obj,cb)
                    }
                    cb(e,r)

                });
            } catch (e) {
                db.end();
                return cb(e,null)
            }
            db.end()
        },
        findOneAndRemove: (obj, cb) => {
            const db = mysql.createConnection(dbOption);
            db.connect();
            try {
                let sql = `DELETE * FROM ${name}`;
                let keyWord = 'WHERE';
                for (key in obj) {
                    if (sql.search(keyWord) > -1) keyWord = 'AND';
                    sql += ` ${keyWord} ${key} = ${obj[key]}`
                }
                db.query(sql, (e,r)=>{
                    if (e && e.code === 'ER_NO_SUCH_TABLE') {
                        db.end();
                        require('../tables/'+Name)(Name);
                        this.table().findOneAndRemove(obj,cb)
                    }
                    if (e && e.code === 'ER_BAD_DB_ERROR') {
                        this.conection();
                        this.table().findOneAndRemove(obj,cb)
                    }
                    cb(e,r)
                });
            } catch (e) {
                db.end();
                return cb(e,null)
            }
            db.end()
        },
        findByIdAndUpdate: (id, obj, cb) => {
            let schem = schems[name];
            let isValidBody = false;
            const db = mysql.createConnection(dbOption);
            db.connect();
            try {
                let sql = `UPDATE ${name} SET `;
                for (key in schem) {
                    if (key !== '$id' && key != 'PRIMARY KEY'
                        && (obj[key] || obj[key] === 0)){
                                isValidBody = true;
                                sql += `${key} = '${obj[key]}', `;
                            }
                }
                if (!isValidBody){
                    db.end();
                    return next({error:`request body invalid`}, null)
                }
                sql = sql.slice(', ',-2) + ' WHERE '+schem.$id+' = '+id ;
                db.query(sql, (e,r)=>{
                    if (e && e.code === 'ER_NO_SUCH_TABLE') {
                        db.end();
                        require('../tables/'+Name)(Name);
                        this.table().findByIdAndUpdate(id, obj,cb)
                    }
                    if (e && e.code === 'ER_BAD_DB_ERROR') {
                        this.conection();
                        this.table().findByIdAndUpdate(obj,cb)
                    }
                    cb(e,r)
                });
            } catch (e) {
                db.end();
                return cb(e,null)
            }
            db.end()
        },
        create: (obj, cb) => {
            let schem = schems[name];
            let isValidBody = false;
            const db = mysql.createConnection(dbOption);
            db.connect();
            let sql = `INSERT INTO ${name} (`;
            for (key in schem) {
                if (key !== '$id' && key != 'PRIMARY KEY'
                    && (obj[key] || obj[key] === 0)) {
                        isValidBody = true;
                        sql += `${key}, `;
                }

            }
            if (!isValidBody){
                const error = {error:`request body invalid`};
                db.end();
                return cb(error, null)
            }

            sql = sql.slice(', ',-2) + ') VALUES (';
            for (key in schem) {
                if (key !== '$id' && key != 'PRIMARY KEY'
                    && (obj[key] || obj[key] === 0)) sql += `'${obj[key]}', `
            }

            sql = sql.slice(', ',-2) + ')';
            db.query(sql, (e,r)=>{
                if (e && e.code === 'ER_NO_SUCH_TABLE') {
                    db.end();
                    require('../tables/'+Name)(Name);
                    this.table().create(obj,cb)
                }
                if (e && e.code === 'ER_BAD_DB_ERROR') {
                    this.conection();
                    this.table().create(obj,cb)
                }
                cb(e,r)
            });
            db.end()
        }
    }
};