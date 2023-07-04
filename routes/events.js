const express = require('express')
const routerE = express.Router()
const mysql = require('mysql2')
const db = require('../db/database.js')
require('dotenv').config()


routerE.get('/create', (req, res) =>{
    if(req.session.logged == true){
        res.render('events/create.ejs')
    }else{
        res.redirect('/login')
    }
    
})

routerE.post('/create', (req, res) =>{
    const event = {
        creator: req.session.userID,
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        address: req.body.address,
        partecipants: req.body.partecipants,
        description: req.body.description
    }
    eventCreated = db.createEvent(event)
    res.redirect('/user/profile')
})


module.exports = routerE