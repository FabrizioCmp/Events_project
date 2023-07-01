const mysql = require('mysql2')
require('dotenv').config()

const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PSW,
    database: 'test_events',
}).promise()

async function getUserById(id){
    const res = await pool.query(`
            SELECT email 
            FROM User 
            WHERE id = ?
            `, [id] )
    return res[0]
}

async function createUser(name, lastname, email, pswd){
    const user = await pool.query(`
            INSERT INTO User (email, password, name, lastname)
            VALUES (?,?,?,?)
            `, [email, pswd, name, lastname])
    return user
}
module.exports = {getUserById, createUser}
