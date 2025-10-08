const mongoose= require('mongoose')

const messageSchema= new mongoose.Schema({
    sender: {type: String, require: true},
    receiver: {type: String, require: true},
    message: {type: String, require: true},
}, {timestamps: true})

module.exports = mongoose.model("Messages", messageSchema)