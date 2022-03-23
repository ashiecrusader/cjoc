const mongoose = require('mongoose')
//First we require mongoose in our player.js file



const schema = mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    clearanceLevel: {
        type: String,
        required: true
    },
    asg: {
        type: String,
        required: true
    }
})
// We use the new operator to create a new Schema and we define the fields,
// For this one I am just going to use User Id and coins, you can add more.
// Also for valid data types you can check the mongoose docs (string, number etc)

module.exports = mongoose.model('logins', schema)
// Now we create a new mongoose model with the name and the schema
