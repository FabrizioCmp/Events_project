const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const db = require('./db/database')
const session = require('express-session')
require('dotenv').config()

// Connessione al DB
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PSW,
    database: 'test_events',
}).promise()

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

//Rotte base
app.get("/", middleware, (req, res) => {
    logged = req.session.logged
    uName = req.session.userName
    res.render('index', {
        text: 'WORLD',
        logged: logged,
        userName: uName,
    })
})


//Auth routes
app.get('/register', (req, res) => {
    res.render('register', {
        oldUsername: null,
        oldEmail: null,
        oldPassword: null,
    })
})

app.post('/register', async (req, res) => {
    
    user = db.getUserByUsername(req.body.username)
    if( user == null){
        const hashedpswd = await bcrypt.hash(req.body.password, 10)
        console.log(2)
        user = await db.createUser(req.body.email, req.body.username, hashedpswd)
        console.log(2)
    
        res.redirect('/login')
    }else{
        res.redirect('/register',{
            oldUsername: req.body.username,
            oldEmail: req.body.email,
            oldPassword: req.body.password,
        })
    }

   

    res.redirect('/register', {
        oldUsernme: req.body.username,
        oldEmail: req.body.email,
        oldpassword: req.body.password,
    })

})

app.get('/login', (req, res) => {
    res.render('login', {
        oldUsername: null,
        notRegistered: false,
        errorPswd: false,
    })
})

app.post('/login', async (req, res) => {
    if (req.body.username && req.body.password) {
        const { username, email, password } = req.body

        usr = await db.getUserByUsername(username)
        if (usr != null) {

            bcrypt.compare(password, usr.password, (err, result) => {
                if (err) {
                    console.error('Errore durante il Login')
                }

                if (result) {
                    req.session.user = usr
                    req.session.userID = usr.id
                    req.session.logged = true
                    res.redirect('user/profile',)
                } else {
                    res.render('login', {
                        oldUsername: username,
                        notRegistered: false,
                        errorPswd: true,
                    })
                    console.log('password errata')
                }
            })
        } else {
            res.render('login', {
                oldUsername: username,
                notRegistered: true,
                errorPswd: false,
            })
            console.log('utente non registrato')
        }
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect('login')
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

