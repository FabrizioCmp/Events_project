// const pool = require('../db/database.js')

// async function getUserById(id){
//     const res = await pool.query(`SELECT eamil FROM Users WHERE id = ${id}` )
//     return res
// }


function errorEmail(email){
    const emailSymbol = email.indexOf('@')
    const dotSymbol = email.lastIndexOf('.')
    const firstChar = email[0]
    const lastChar = email[email.length - 1]

    if(emailSymbol === -1 || emailSymbol >= dotSymbol || dotSymbol === -1 || dotSymbol === email.length - 1 ){
        return true
    }

    if (firstChar === "@" || firstChar === "." || lastChar === "@" || lastChar === "."){
        return true
    }

    return false
}

module.exports = {errorEmail}
