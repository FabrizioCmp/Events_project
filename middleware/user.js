//middleware per la rotta user
function middlewareLogIn(req, res, next) {
    console.log('check login')
    next()
}

module.exports = {middlewareLogIn}