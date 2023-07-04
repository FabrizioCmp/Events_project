const mysql = require('mysql2')
require('dotenv').config()

const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PSW,
    database: process.env.DB_NAME
}).promise()

async function getUserById(id){
    const res = await pool.query(`
            SELECT * 
            FROM Users 
            WHERE id = ?
            `, [id] )
    return res[0]
}

async function getUserByUsername(username){
    const res = await pool.query(`
            SELECT *
            FROM Users
            WHERE username = ?
        `,[username])
        if(res[0].length != 0){
            return res[0][0]
        }else{
            return null
        }
}

async function createUser(email, username, pswd){
   
    const search = await getUserByEmail(email)
    console.log(search)
   
    if(search == null){
    const user = await pool.query(`
            INSERT INTO Users (email, username, password)
            VALUES (?,?,?)
            `, [email, username, pswd])
    return user[0]
    }else{
        console.log('utente  non creato')
    }
}

async function getUserByEmail(email){
    const user = await pool.query(`
            SELECT *
            FROM Users
            WHERE  email = ?
    `, [email])

    if(user[0].length != 0){
        return user[0][0]
    }else{
        return null
    }
}

async function getEvents(){
    const events = await pool.query(`
            SELECT * 
            FROM Events
            ORDER BY date, time
        `)
    return events[0]
}

async function createEvent(event){
    const eventCreated = await pool.query(`
        INSERT INTO Events (title, description, image, date, time, address, max_participants, creator)
        VALUES (?,?,?,?,?,?,?,?)
    `, [event.title, event.description, " ", event.date, event.time, event.address, event.partecipants, event.creator])
    return eventCreated[0]
}
module.exports = {getUserById, createUser, getUserByEmail, getUserByUsername, createEvent, getEvents}
