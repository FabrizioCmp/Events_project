const express = require('express')
const mid = require('../middleware/user.js')
const router = express.Router()


router.use(mid.middlewareLogIn)

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


//user routing middleware per ogni volta che è presente id nella rotta 
router.param("id", (req, res, next, id) => {
    console.log(id)
    next()
})




module.exports = router