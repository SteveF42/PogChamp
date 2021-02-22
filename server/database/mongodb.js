const mongoose = require('mongoose')
require('dotenv').config()

const mongo = {
    connection: null
}

options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connect = (cb) => {   
    mongoose.connect(process.env.DATABASE_LINK,options)
    const conn = mongoose.connection
    conn.on('err',(err)=>cb(err))
    conn.once('open',()=>{
        if(conn.connection == null){
            mongo.connection = conn
            cb()
        }
    })
}
    
module.exports = {connect,mongo}