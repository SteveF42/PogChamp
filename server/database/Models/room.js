const mongoose = require('mongoose')



const RoomSchema = new mongoose.Schema({
    code: {type:String, unique : true, required : true},
    host: {type:String, unique : true, required : true},
    votesToSkip: {type: Number, default:0, required:true},
    usersCanQueue: {type:Boolean, required:true},
    usersCanSkip: {type:Boolean, required:true},

})

module.exports =  mongoose.model('rooms',RoomSchema)