const sqlTable = require('../lib/sqlTable');
module.exports = table =>{
    const schema = {
        dpID: 'int AUTO_INCREMENT',
        dpName: 'VARCHAR(255)',
        createdBy: {
            type: 'int',
            join: 'client',
            joinId: 'cID'
        },
        "PRIMARY KEY": '(dpID)',
        $id: 'dpID',
        $options: {
            getByOwner: 'createdBy'
        }
    };
    sqlTable.model(table, schema)
};

