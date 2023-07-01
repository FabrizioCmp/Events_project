const pool = require('../db/database.js')

async function getUserById(id){
    const res = await pool.query(`SELECT eamil FROM Users WHERE id = ${id}` )
    return res
}

console.log(getUserById(1))
