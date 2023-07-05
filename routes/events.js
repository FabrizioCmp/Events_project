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

routerE.post('/create', async (req, res) =>{
    const event = {
        creator: req.session.userID,
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        address: req.body.address,
        partecipants: req.body.partecipants,
        description: req.body.description
    }
    eventCreated = await db.createEvent(event)
    res.redirect('/user/profile')
})

routerE.get('/:id', async (req, res) =>{

    if(req.session.logged){
        const singleEvent = await db.getEventById(req.params.id)
        const creatorId = singleEvent?.creator ?? null
        if(creatorId == req.session.userID){
            res.render('eventpage', {event: singleEvent})
        }else{
            res.redirect('/')
        }
    }else{
        res.redirect('/login')
    }
   
    
})

module.exports = routerE