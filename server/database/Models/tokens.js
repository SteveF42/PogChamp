const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
    user:{type:String,required:true},
    access_token:{type:String, required:true},
    token_type:{type:String,required:true},
    scope:{type:String,required:true},
    expires_in:{type:String,required:true},
    scope:{type:String,required:true}
})

module.exports = mongoose.model('tokens',tokenSchema)