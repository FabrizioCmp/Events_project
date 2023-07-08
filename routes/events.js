const express = require('express')
const routerE = express.Router()
const mysql = require('mysql2')
const db = require('../db/database.js')
const multer = require('multer')
const path = require('path')
require('dotenv').config()

// configurazione Multer per storage delle immagini


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req,file,cb) =>{
        const fileName = file.fieldname + '_' + Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }
})
const upload = multer({
    storage: storage
})



routerE.get('/create', (req, res) =>{
    if(req.session.logged == true){
        res.render('events/create.ejs')
    }else{
        res.redirect('/login')
    }
    
})

routerE.post('/create', upload.single('image') , async (req, res) =>{
    const event = {
        creator: req.session.userID,
        filePath: req.file.path,
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

routerE.get('/update/:id', async (req,res) =>{
    const singleEvent = await db.getEventById(req.params.id)
    const creatorId = singleEvent?.creator ?? null

    if(req.session.logged && creatorId == req.session.userID){
        console.log(singleEvent)
        res.render('events/update', {
            uevent: singleEvent
        })
    }

})

routerE.post('/update/:id', async (req, res) =>{
    const newEvent = {
        id : req.params.id,
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        address: req.body.address,
        max_participants: req.body.participants,
        description: req.body.description
    }
    const event_updated = await db.updateEvent(newEvent)
    res.redirect('/event/'+newEvent.id)
})

routerE.get('/:id', async (req, res) =>{
    const singleEvent = await db.getEventById(req.params.id)
    singleEvent.image = singleEvent.image.slice(7)
    const creatorId = singleEvent?.creator ?? null

    if(req.session.logged && creatorId == req.session.userID){
        res.render('eventpage', {event: singleEvent})
        console.log(singleEvent.image)
    }else{
        res.render('eventpage_public', {event: singleEvent})
        console.log(singleEvent.image)
    }
    
})

routerE.post("/participate", async (req,res) =>{
    const participant = await db.getParticipantByEmail(req.body.email)
    const eventMaxPart = await db.getMaxParticipants(req.body.eventId)
    const countParticipants = await db.getCountParticipants(req.body.eventId)
    console.log(eventMaxPart[0])
    console.log(countParticipants[0])
    if(participant != null ){
        res.redirect('/event/'+ req.body.eventId)
    }else if(countParticipants[0].count < eventMaxPart[0].max_participants){
        res.redirect('/event/'+ req.body.eventId)
        console.log("iscritto")
    }else{
        res.redirect('/event/'+ req.body.eventId)
    }
})

routerE.delete('/:id', async (req, res) =>{
     await db.deleteEvent(req.params.id)
    res.send({message: "Event deleted"})
})

module.exports = routerE