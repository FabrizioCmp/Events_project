const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const db = require('./db/database')
const session = require('express-session')
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PSW,
    database: 'test_events',
}).promise()

const users = []

const app = express()

//impostazioni server
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        sameSite: 'strict'
    },
    resave: false,
    saveUninitialized: true,
}))


//porta del server
app.listen(3001)

app.get("/", middleware, (req, res) => {
    logged = req.session.logged
    uName = req.session.userName
    res.render('index', {
         text: 'WORLD',
         logged: logged,
         userName: uName,
 })
})

app.get("/login", (req, res) => {
    res.render('login')
})
app.get("/register", (req, res) => {
    res.render('register')
})

app.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect('login')
})

//Auth routes
app.post('/register', async (req, res) => {
    try {

        const hashedpswd = await bcrypt.hash(req.body.password, 10)

        user = await db.createUser(req.body.name, req.body.lastname, req.body.email, hashedpswd)

        us = await db.getUserByEmail('prossi@mail.com')

        console.log(us)
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        const { email, password } = req.body

        usr = await db.getUserByEmail(email)
        if (usr != null) {
            
            bcrypt.compare(password, usr.password, (err, result) => {
                if (err) {
                    console.error('Errore durante il Login')
                }

                if (result) {
                    req.session.userName = usr.name
                    req.session.userID = usr.id
                    req.session.logged = true
                    res.redirect('user/profile',)
                } else {
                    res.render('login')
                    console.log('password errata')
                }
            })
        }else{
            res.render('login')
            console.log('utente non registrato')
        }
    }
})


//Routing
const userRouter = require('./routes/users')
const { emit } = require('nodemon')
app.use('/user', userRouter)



//middleware
function middleware(req, res, next) {
    console.log(req.originalUrl)
    next()
}

