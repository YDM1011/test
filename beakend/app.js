const express = require('express');
const config = require('./app/config/config');
const glob = require('glob');
const sqlTable = require('./app/lib/sqlTable');

sqlTable.conection(config.db);
let tables = glob.sync('./app/tables/*.js');
tables.forEach(table => {
    require(table)(table.match(/\w+(?=.js)/gm)[0]);
});
let app = express();
module.exports = require('./app/config/express')(app, config);