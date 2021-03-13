const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const app = express()
const server = require('http').createServer(app)
const api = require('./routes/api')
const spotify = require('./routes/spotify')
const db = require('./database/mongodb')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const io = require('socket.io')(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:["GET","POST"],
        credentials:true,
    }
})

/* 
    filename: server.js 
    description: main entry point of the application
*/
const cors = require('cors')
const path = require('path');
const room = require('./database/Models/room');
require('dotenv').config()

db.connect((err) => {
    if (err) {
        console.log('unable to connect to database, exiting...')
    } else {
        console.log('server running on port 5000')
        server.listen(5000)
    }
})

app.use(express.static(path.join(__dirname, 'build')))

//middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(session({
    secret: process.env.SECRET_KEY,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 1 * 24 * 60 * 60, //30 days
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    }
}))

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.json())


app.use('/api', api)
app.use('/spotify', spotify)
app.use('*', (req, res) => {
    res.sendFile('build/index.html', { root: './server' })
})

io.on('connection', (socket) => {
    //when user joins room assign them to their room code
    socket.on('joinRoom', (code) => {
        socket.join(code)
    })
    //when host gets the current song they'll share it to others in the room
    socket.on('shareCurrentSong', (currentSong, code) => {
        socket.broadcast.to(code).emit('currentSong', { ...currentSong, isHost: false })
    })
    //shares the roomInfo from the host
    socket.on('shareRoomInfo', (roomInfo, code) => {
        socket.broadcast.to(code).emit('roomInfo', { ...roomInfo, isHost: false })
    })
    socket.on('play', (code) => {
        console.log('play',code)
        io.to(code).emit('isPlaying', true)

    })
    socket.on('pause', (code) => {
        console.log('pause',code)
        io.to(code).emit('isPaused', false)

    })
})