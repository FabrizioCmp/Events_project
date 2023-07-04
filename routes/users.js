const express = require('express')
const mid = require('../middleware/user.js')
const router = express.Router()
const mysql = require('mysql2')
const db = require('../db/database.js')
require('dotenv').config()



const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PSW,
    database: 'test_events',
}).promise()


router.use(mid.middlewareLogIn)


router.get('/profile', (req, res) => {
    if(req.session.logged == true){
        res.render('profile')
    }else{
        res.redirect('/login')
    }
})

router.get('/:id', async(req, res) =>{
    const user = await db.getUserById(1)
    console.log(user)
    res.send(user)
})




//user routing middleware per ogni volta che è presente id nella rotta 
router.param("id", (req, res, next, id) => {
    console.log(id)
    next()
})




module.exports = router