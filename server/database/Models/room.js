const mongoose = require('mongoose')



const RoomSchema = new mongoose.Schema({
    code: {type:String, unique : true, required : true},
    host: {type:String, unique : true, required : true},
    votesToSkip: {type: Number, default:0, required:true},
    usersCanQueue: {type:Boolean, required:true, defualt: false},
    usersCanSkip: {type:Boolean, required:true,default: false},
    usersCanPlayPause:{type:Boolean, required:true, default: false},
    expireAt: {type:Date, index:{expireAfterSeconds:0}}

})

module.exports =  mongoose.model('rooms',RoomSchema)
