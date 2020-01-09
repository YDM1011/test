const sqlTable = require('../lib/sqlTable');
module.exports = table =>{
    const schema = {
        cID: 'int AUTO_INCREMENT',
        cName: 'VARCHAR(255)',
        login: 'VARCHAR(255)',
        password: 'VARCHAR(255)',
        token: 'TEXT',
        "PRIMARY KEY": '(cID)',
        UNIQUE: '(login)',
        $id: 'cID'
    };
    sqlTable.model(table, schema)
};

