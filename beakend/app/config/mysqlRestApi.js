
module.exports = backendApp => {
    const apiRouter = backendApp.express.Router();
    const restify = require('../lib/restify');
    const sqlTable = require('../lib/sqlTable');
    const tables = sqlTable.tables();
    const next = (req,res,next) => next();

    tables.forEach(table=>{
        restify(apiRouter, table.tableName, {
            prefix: '',
            idProperty: table.tableId,
            preCreate: [table.options.getByOwner ? backendApp.middlewares.getByOwner : next],
            preUpdate: [table.options.getByOwner ? backendApp.middlewares.getByOwner : next],
            preDelete: [table.options.getByOwner ? backendApp.middlewares.getByOwner : next],
            preRead: [table.options.getByOwner ? backendApp.middlewares.getByOwner : next],
            postRead: []
        });
    });

    backendApp.app.use("/api", apiRouter);
};