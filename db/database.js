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
    const search = await getUserByEmail(email)
    if(search == null){
    const user = await pool.query(`
            INSERT INTO User (email, password, name, lastname)
            VALUES (?,?,?,?)
            `, [email, pswd, name, lastname])
    return user[0]
    }
}

async function getUserByEmail(email){
    const user = await pool.query(`
            SELECT *
            FROM User
            WHERE  email = ?
    `, [email])
    return user[0][0].email ? user[0][0] : null
}
module.exports = {getUserById, createUser, getUserByEmail}
