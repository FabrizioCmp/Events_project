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
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running at PORT: ${process.env.SERVER_PORT}`)
})

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

    user = await db.getUserByUsername(req.body.username)
    errorPswd = false
    errorUser = false

    //se user = null allora si tratta di un nuovo utente -> controllo vadilità pswd
    if (user == null) {

        //controllo uguaglianza password e password di conferma
        if (req.body.password == req.body.confirm) {
            const hashedpswd = await bcrypt.hash(req.body.password, 10)
            user = await db.createUser(req.body.email, req.body.username, hashedpswd)
            app.redirect('login')

        } else {
            // le due password sono diverse
            errorPswd = true
            res.render('register', {
                oldUsername: req.body.username,
                oldEmail: req.body.email,
                oldPassword: req.body.password,
                differentPswd: errorPswd,
            })
        }
    } else {
    // si tratta di un username già presente -> reindirizzo al form di registrazione mosrtando un Alert
    // e ricompilando i campi con i dati precedentemente inseriti
        errorUser = true
        res.render('register', {
            oldUsername: req.body.username,
            oldEmail: req.body.email,
            oldPassword: req.body.password,
            userTaken: errorUser
        })
    }

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

