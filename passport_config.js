const { authenticate } = require('passport')
const bcrypt = require('bcrypt')

const localStrategy = require('passport-local').Strategy


function initialize(passport){
    const authenticateUser = async(email, password, done) =>{
        const user = getUser(email)
        if (user == null){
            return done(null, false, {message: "Nessun utente è associato a quell'email "})
        }

        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message: "Password errata"})
            }
        } catch(e) {
            return done(e)
        }
    }
    passport.use(new localStrategy({ usernameField: 'email'}), authenticateUser)
    passport.serializeUser((user, done)=>{ })
    passport.deserializeUser((id, done)=>{ })
}

function getUser(email){

}

module.exports = {initialize}