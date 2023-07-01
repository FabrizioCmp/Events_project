const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const pport = require('passport')
const db = require('./db/database')
require('dotenv').config()

const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PSW,
    database: 'test_events',
}).promise()

const initPassport = require('./passport_config')
//initPassport(passport, email)

const users = []

const app = express()

//impostazioni server
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))


//porta del server
app.listen(3001)

app.get("/", middleware, (req, res) =>{
    res.render('index', { text: 'WORLD'})
})

app.get("/login", (req, res)=>{
    res.render('login')
})
app.get("/register", (req, res)=>{
    res.render('register')
})

//Auth routes
app.post('/register', async (req,res)=>{
    try{
        const hashedpswd = await bcrypt.hash(req.body.password, 10)
        users.push({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedpswd
        })

        user = db.createUser(req.body.name,req.body.lastname, req.body.email, hashedpswd)

        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.get('/login', (req, res) =>{
    res.render('login')
})

//Routing
const userRouter = require('./routes/users')
const passport = require('passport')
const { emit } = require('nodemon')
app.use('/user', userRouter)



//middleware
function middleware(req, res, next){
    console.log(req.originalUrl)
    next()
}

