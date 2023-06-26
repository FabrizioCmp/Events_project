const express = require('express')
const router = express.Router()

router.use(middlewareLogIn)

router.get("/", (req,res) =>{
    res.send("user  home")
})

router.get("/profile", (req,res) =>{
    res.send("user  profile")
})

router.get('/:id', (req, res) =>{
    let userID = req.params.id
    res.send(`getting user ${userID}`)
})

//middleware per la rotta user
function middlewareLogIn(req, res, next) {
    console.log('check login')
    next()
}

//user routing middleware per ogni volta che è presente id nella rotta 
router.param("id", (req, res, next, id) => {
    console.log(id)
    next()
})




module.exports = router