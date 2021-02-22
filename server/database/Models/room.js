const mongoose = require('mongoose')



const RoomSchema = new mongoose.Schema({
    code: {Type:String, required:true},
    votesToSkip: {Type:Number, default: 0},
    votes: {Type: Number, default:0},
    host: {Type:String, required: true}
})

mongoose.model('rooms',RoomSchema,'rooms')