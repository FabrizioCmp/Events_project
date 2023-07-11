const mysql = require('mysql2')
require('dotenv').config()

const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
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
            ORDER BY date , time 
        `)
    if(events[0].length != 0){
        return events[0]
    }else{
        return null
    }
}

async function getUserEvents(id){
    const events = await pool.query(`
            SELECT *
            FROM Events 
            WHERE creator = ?
            ORDER BY date , time 
        `, [id])

    return events[0]
}

async function createEvent(event){
    const eventCreated = await pool.query(`
        INSERT INTO Events (title, description, image, date, time, address, max_participants, creator)
        VALUES (?,?,?,?,?,?,?,?)
    `, [event.title, event.description, event.filePath, event.date, event.time, event.address, event.partecipants, event.creator])
    return eventCreated[0]
}

async function getEventById(id){
    const event = await pool.query(`
                SELECT *
                FROM Events
                WHERE id = ?
        `, [id])
    return event[0][0]
}

async function updateEvent(e){
    const event = await pool.query(`
            UPDATE Events
            SET title = ?, description = ?, image = ?, date = ?, time = ?, address = ?, max_participants = ?
            WHERE id = ?
    `, [e.title, e.description, e.image, e.date, e.time, e.address, e.max_participants, e.id])
    return event
}

async function getMaxParticipants(id){
    const part = await pool.query(`
            SELECT max_participants
            FROM Events
            WHERE id = ?
    `, [id])
    return part[0]
}
async function getCountParticipants(event){
    const count = await pool.query(`
            SELECT COUNT(id) AS count
            FROM Participants
            WHERE event = ?
    `,[event])

    return count[0]
}
async function deleteEvent(id){
    const event = await pool.query(`
            DELETE FROM Events 
            WHERE id = ?
        `, [id])
}

async function addParticipant(email, event){
    const part = await pool.query(`
            INSERT INTO Participants (email, event)
            VALUES (?,?)
    `,[email, event])
    return part[0]
}

async function getParticipantByEmail(email,){
    const participant = await pool.query(`
            SELECT * 
            FROM Participants
            WHERE email = ?
        `, [email])

    if(participant[0].length != 0){
            return participant[0]
     }else{
            return null
     } 
}

async function getThisEventUserPart(email, event){
    const participant = await pool.query(`
            SELECT * 
            FROM Participants
            WHERE email = ? AND event = ?
        `, [email, event])

    if(participant[0].length != 0){
            return participant[0]
     }else{
            return null
     } 
}

async function getUserPart(email){
    const partEvents = await pool.query(`
            SELECT event 
            FROM Participants
            WHERE email = ?
    `, [email])
    let partList = []
    partEvents[0].forEach(element => {
        partList.push(element.event)
    });
    return partList
}

async function getEventsfromPart(arrayId){
    const events = await pool.query(`
                SELECT *
                FROM Events
                WHERE id IN (?)
    `, [arrayId])
    return events[0]
}

async function deletePart(event, email){
    const e = await pool.query(`
            DELETE FROM Participants
            WHERE event = ? AND email = ?
        `, [event, email])
    console.log(event, email)
    return e
}

module.exports = {getUserById, createUser, getUserByEmail, getUserByUsername, createEvent, getEvents, getUserEvents, getEventById, updateEvent, getParticipantByEmail , deleteEvent, getMaxParticipants, getThisEventUserPart, getEventsfromPart, getCountParticipants, addParticipant, getUserPart, deletePart}
