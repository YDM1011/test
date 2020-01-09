const sqlTable = require('../lib/sqlTable');
module.exports = table =>{
    const schema = {
        empID: 'int AUTO_INCREMENT',
        empName: 'VARCHAR(255)',
        empActive: 'BOOLEAN',
        emp_dpID: {
            type: 'int',
            join: 'tblDepartments',
            joinId: 'dpID'
        },
        createdBy: {
            type: 'int',
            join: 'client',
            joinId: 'cID'
        },
        "PRIMARY KEY": '(empID)',
        $id: 'empID',
        $options: {
            getByOwner: 'createdBy'
        }
    };
    sqlTable.model(table, schema)
};

