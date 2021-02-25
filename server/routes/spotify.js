const router = require('express').Router()
const fetch = require('node-fetch')
const {isAuthenticated,refreshTokens,updateOrCreateTokens,callSpotifyApi} = require('./spotifyUtils/utils')
const Rooms = require('../database/Models/room')
const Tokens = require('../database/Models/tokens')
const querystring = require('querystring')
require('dotenv')

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

router.get('/getAuthUrl', async (req, res) => {
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${process.env.SPOTIFY_SCOPE}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}`
    res.json({ url: url })
})

router.post('/callback', async (req, res) => {
    const code = req.body.code
    console.log('callback', req.sessionID)

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers:{
            "Accept": "application/json",
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id : process.env.SPOTIFY_CLIENT_ID,
            client_secret:process.env.SPOTIFY_CLIENT_SECRET
        })
    })
    const data = await response.json()

    if (req.session.hasValidToken == null) {
        req.session['authenticated'] = true
    }
    updateOrCreateTokens(data, req.session.id)

    res.status(200).json({success:true})
})

router.get('/isAuthenticated',async (req,res)=>{
    try{
        const auth = await isAuthenticated(req.session.id)
        res.status(200).json({authenticated:auth})
    }catch(err){
        console.log(err)
        res.status(501).json({message:err,authenticated:false})
    }
})

router.put('/play',async (req,res)=>{
    const apiEndPoint = 'me/player/play'
    const room = await Rooms.findOne({code:req.body.code})

    if(room == null) {res.status(404); return}

    const host = room.host
    if(req.sessionID === host || room.usersCanPlayPause){
        callSpotifyApi(apiEndPoint,host,'PUT')
    }
    res.status(200).json({message:'success'})

})

router.put('/pause',async (req,res) => {
    const apiEndPoint = 'me/player/pause'
    const room = await Rooms.findOne({code:req.body.code})
    if(room == null){res.status(404);return}

    const host = room.host
    if(req.sessionID === host || room.usersCanPlayPause){
        callSpotifyApi(apiEndPoint,host,'PUT')
    }
    res.status(200).json({message:'success'})
})

router.post('/refreshTokens', async (req,res) => {
    try{
        const tokens = await Tokens.findOne({user:req.session.id})
        const response = await refreshTokens(tokens,req.sessionID)
        if(response.error!=null){
            res.status(401).json({message:response.error_description})
        }else{
            res.status(200)
        }
    }catch(err){
        console.log(err)
        res.status(401).json({message:'access denied'})
    }
})

router.post('/currentlyPlaying', async (req,res) => {
    const apiEndPoint = 'me/player/currently-playing'
    const room = await Rooms.findOne({code:req.body.code})
    if(room == null){res.status(404);return}

    const host = room.host
    const response = await callSpotifyApi(apiEndPoint,host,'GET')
    
    try{
        const json = await response.json()
        res.status(200).json({song:json})
    }catch(err){
        res.status(204).json({song:err})
    }
})

module.exports = router