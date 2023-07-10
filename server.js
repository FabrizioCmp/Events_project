const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const db = require('./db/database')
const session = require('express-session')


require('dotenv').config()



//impostazioni server
const app = express()
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
app.get("/", async (req, res) => {
    const elist = await db.getEvents()
    elist?.forEach(element => {
        let d = new Date(element.date)
        element.date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear()
    });
    let uEvents = null
    logged = req.session.logged
    uName = req.session.user
    if (logged) {
        id = req.session.userID
        uEvents = await db.getUserEvents(id)
        uEvents.forEach(element => {
            let d = new Date(element.date)
            element.date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear()
            element.image = element.image.slice(7)
        });
    }
    console.log(uName)
    res.render('index', {
        text: 'WORLD',
        logged: logged,
        userName: uName,
        eventsList: elist,
        userEvents: uEvents,
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
            res.redirect('login')

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
                    console.log(usr)
                    req.session.user = usr.username
                    req.session.userID = usr.id
                    req.session.logged = true
                    res.redirect('/userprofile',)
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

app.get("/userProfile", async (req, res) => {

    if (req.session.logged == true) {
        //query a database
        const u = await db.getUserById(req.session.userID) // ritorna informazioni utente loggato
        const Euser = await db.getUserEvents(req.session.userID) // ritorna eventi creati dall' utente
        const userPart = await db.getUserPart(u[0].email)  //ritrona array di ID relativi algli eventi partecipati dall'utente
        let userEparts = []
        if (userPart.length != 0) {
            userEparts = await db.getEventsfromPart(userPart) // ritorna array degli eventi partecipati dall'utente
        }

        console.log(u[0])

        //modifica formato data e orario
        userEparts.forEach(element => {
            let d = new Date(element.date)
            const month = d.getMonth() + 1
            element.date = d.getDate() + "-" + month + "-" + d.getFullYear()
            element.time = element.time.slice(0, 5)
        });
        Euser.forEach(element => {
            let d = new Date(element.date)
            const umonth = d.getMonth() + 1
            element.date = d.getDate() + "-" + umonth + "-" + d.getFullYear()
            element.time = element.time.slice(0, 5)
        });

        res.render('userprofile', {
            logged: req.session.logged,
            user: u[0],
            userEvents: Euser,
            userParticipations: userPart,
            userEventsParticipations: userEparts
        })
    } else {
        res.redirect('/login')
    }
})

app.delete('/part/:id', async (req, res) => {
    const u = await db.getUserById(req.session.userID)
    console.log(req.params.id)
    console.log(u[0].email)
    const p = await db.deletePart(req.params.id, u[0].email)
    console.log('parteciapzione cancellata--------')
    console.log(p[0])
    res.send({ message: "partecipazione cancellata" })
})


//Routing
const userRouter = require('./routes/users')
const eventRouter = require('./routes/events')
const { emit } = require('nodemon')
const multer = require('multer')
app.use('/user', userRouter)
app.use('/event', eventRouter)



//middleware
function middleware(req, res, next) {
    console.log(req.originalUrl)
    next()
}

