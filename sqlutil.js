module.exports = {
    createConnection, returnFound
}

// Returns true if X is found
function returnFound(db, table, x) {
    let sql = `SELECT uid FROM ${table} WHERE uid=?`;
    let params = [x];

    db.get(sql, params, async (err, row) => {
        if (err)
        {
            console.error(err.message);
            return 0;
        }
        if (row) return true; else false;
    });
}

function createConnection(){
    return 0;
}