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
    console.log(search)
   
    if(search == null){
    const user = await pool.query(`
            INSERT INTO User (email, password, name, lastname)
            VALUES (?,?,?,?)
            `, [email, pswd, name, lastname])
    return user[0]
    }else{
        console.log('utente  non creato')
    }
}

async function getUserByEmail(email){
    console.log(1)
    const user = await pool.query(`
            SELECT *
            FROM User
            WHERE  email = ?
    `, [email])
    
    if(user[0].length != 0){
        return user[0][0]
    }else{
        return null
    }
}
module.exports = {getUserById, createUser, getUserByEmail}
