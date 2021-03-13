/* 
    filename: room.js 
    description: room schema for monogdb
*/
const mongoose = require('mongoose')
require('mongoose-type-url')


const RoomSchema = new mongoose.Schema({
    code: {type:String, unique : true, required : true},
    host: {type:String, unique : true, required : true},
    currentVotes:{type:Number, required: true, defualt: 0},
    votesToSkip: {type:Number, required:true, defualt: 0},
    usersCanQueue: {type:Boolean, required:true, defualt: false},
    usersCanSkip: {type:Boolean, required:true,default: false},
    usersCanPlayPause:{type:Boolean, required:true, default: false},
    expireAt: {type:Date, index:{expireAfterSeconds:0}},
    songQueue:[{
        imgSrc: mongoose.SchemaTypes.Url,
        artists: [{type:String}],
        songName: {type:String},
        songLength: {type:String},
        context_uri: {type:String},
        trackNumber: {type:String},
    }],

})

module.exports =  mongoose.model('rooms',RoomSchema)
