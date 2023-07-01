const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')

const users = []

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
            id: Date.now().toString(),
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedpswd
        })

        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

//Routing
const userRouter = require('./routes/users')
app.use('/user', userRouter)



//middleware
function middleware(req, res, next){
    console.log(req.originalUrl)
    next()
}

