const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const app = express()
const server = require('http').createServer(app)
const api = require('./routes/api')
const spotify = require('./routes/spotify')
const db = require('./database/mongodb')
require('dotenv').config()

db.connect((err) => {
    if (err) {
        console.log('unable to connect to database, exiting...')
    } else {
        console.log('server running on port 5000')
        server.listen(5000)
        afterConn()
    }
})

const afterConn = () => {
    app.use(session({
        secret: process.env.SECRET_KEY,
        store: new MongoStore({
            mongooseConnection: db.mongo.connection,
            ttl: 1*24*60*60, //1 day
        }),
        resave: false,
        saveUninitialized:false,
    }))
}


//middleware
app.use(express.json())
app.use('/api', api)
app.use('/spotify', spotify)


