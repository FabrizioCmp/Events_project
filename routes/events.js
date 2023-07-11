const express = require('express')
const routerE = express.Router()
const mysql = require('mysql2')
const db = require('../db/database.js')
const multer = require('multer')
const path = require('path')
const { log } = require('console')


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
        res.render('events/create.ejs',{
            logged: req.session.logged
        })
    }else{
        res.redirect('/login')
    }
    
})

routerE.post('/create', upload.single('image') , async (req, res) =>{
    const event = {
        creator: req.session.userID,
        filePath: req.file?.path,
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        address: req.body.address,
        partecipants: req.body.partecipants,
        description: req.body.description
    }
    eventCreated = await db.createEvent(event)
    res.redirect('/userProfile')
})

routerE.get('/update/:id', async (req,res) =>{
    const singleEvent = await db.getEventById(req.params.id)
    const creatorId = singleEvent?.creator ?? null

     // formattazione data ed orario
     let d = new Date(singleEvent.date)
     let month = d.getMonth() + 1
     let day = d.getDate()
     if(month < 10){
        month = month.toString().padStart(2, "0");
     }
     if(day < 10){
        day = day.toString().padStart(2,"0")
     }
     
     singleEvent.date =d.getFullYear() + "-" + month + "-" + day
     singleEvent.time = singleEvent.time.slice(0, 5)

    if(req.session.logged && creatorId == req.session.userID){
        console.log(singleEvent)
        res.render('events/update', {
            uevent: singleEvent,
            logged: req.session.logged
        })
    }

})

routerE.post('/update/:id', async (req, res) =>{
    console.log("req")
    console.log(req.body)
    const newEvent = {
        id : req.params.id,
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        address: req.body.address,
        max_participants: req.body.participants,
        description: req.body.description
    }
    console.log(newEvent)
    const event_updated = await db.updateEvent(newEvent)
    res.redirect('/event/'+newEvent.id)
})

routerE.get('/:id', async (req, res) =>{
    const singleEvent = await db.getEventById(req.params.id)
    const creator = await db.getUserById(singleEvent.creator)
    console.log(creator[0])

    // formattazione data ed orario
    let d = new Date(singleEvent.date)
    const month = d.getMonth() + 1
    singleEvent.date = d.getDate() + "-" + month + "-" + d.getFullYear()
    singleEvent.time = singleEvent.time.slice(0, 5)

    const participants = await db.getCountParticipants(req.params.id)
    singleEvent.image = singleEvent.image?.slice(7)
    const creatorId = singleEvent?.creator ?? null
    console.log(participants)
    let e = ''
    let c = ''
    let p = ''
    let r = ''
    if(req.query.enrolled){
         e = req.query.enrolled
         console.log(e)
    }
    if(req.query.complete){
         c = req.query.complete
         console.log(c)
    }
    if(req.query.part){
         p = req.query.part
         console.log(p)
    }
    if(req.query.register){
        r = req.query.register
        console.log(r)
    }
    

    if(req.session.logged && creatorId == req.session.userID){
        res.render('eventpage', {
            event: singleEvent,
            enrolled: e,
            complete: c,
            part: p,
            participants: participants[0].count,
            logged : req.session.logged,
            })
        console.log(singleEvent.image)
    }else{
        res.render('eventpage_public', {
            event: singleEvent,
            enrolled: e,
            complete: c,
            part: p,
            register: r,
            participants: participants[0].count,
            logged : req.session.logged,
            eventCreator: creator[0].username
        })
        console.log(singleEvent.image)
    }
    
})

routerE.post("/participate", async (req,res) =>{
    const user = await db.getUserByEmail(req.body.email)
    const participant = await db.getThisEventUserPart(req.body.email, req.body.eventId)
    const eventMaxPart = await db.getMaxParticipants(req.body.eventId)
    const countParticipants = await db.getCountParticipants(req.body.eventId)
    console.log("LOG partecipazione")
    console.log(user)
    console.log(participant)
    console.log(eventMaxPart[0])
    console.log(countParticipants[0])
    console.log("end LOG")
    if(user != null ){
        if(participant == null && (countParticipants[0].count < eventMaxPart[0].max_participants)){
            res.redirect('/event/'+ req.body.eventId + '?enrolled=true')
            db.addParticipant(user.email, req.body.eventId)
            console.log("iscritto")
        }else if(countParticipants[0].count >= eventMaxPart[0].max_participants){
            res.redirect('/event/'+ req.body.eventId + '?complete=true')
            console.log("L'evento è al completo")
        }else{
            res.redirect('/event/'+ req.body.eventId + '?part=true')
            console.log('Partecipi già a questo evento')
        }
       
    }else {
        res.redirect('/event/'+ req.body.eventId + '?register=true')
        console.log('devi essere registrato per partecipare')   
    }
})

routerE.delete('/:id', async (req, res) =>{
     await db.deleteEvent(req.params.id)
    res.send({message: "Event deleted"})
})

module.exports = routerE