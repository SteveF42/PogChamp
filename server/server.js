const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const app = express()
const server = require('http').createServer(app)
const api = require('./routes/api')

app.use('/api',api)


server.listen(5000)