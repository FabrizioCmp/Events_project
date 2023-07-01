const express = require('express')
const mysql = require('mysql2')

const app = express()
// mysql.createPool({
//     host: '127.0.0.1',
//     user : 'root',
//     password: 'Ipgeuniev3,14',
//     database: 'events_app'
// })


//impostazioni server
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))


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

//Routing
const userRouter = require('./routes/users')
app.use('/user', userRouter)

//middleware
function middleware(req, res, next){
    console.log(req.originalUrl)
    next()
}

