/* 
    filename: spotify.js 
    description: spotify routes which control playing,pausing,choosing songs
        , fetching current song, and skipping songs
*/
const router = require('express').Router()
const fetch = require('node-fetch')
const {isAuthenticated,refreshTokens,updateOrCreateTokens,callSpotifyApi,updateSongQueue} = require('./spotifyUtils/utils')
const Rooms = require('../database/Models/room')
const Tokens = require('../database/Models/tokens')
const querystring = require('querystring')
const { isatty } = require('tty')
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
    const body = req.body.context_uri==='' ? {} : {
        offset: req.body.offset,
        context_uri: req.body.context_uri,
    }
    
    if(room == null) {res.status(404); return}
    
    const host = room.host
    if(req.sessionID===host){
        await isAuthenticated(req.sessionID)
    }

    if(req.sessionID === host || room.usersCanPlayPause){
        callSpotifyApi(apiEndPoint,host,'PUT',body)
    }else{
        res.status(401).json({message:'unauthorized'})
        return;
    }
    res.status(200).json({message:'success'})

})

router.put('/playNewDevice',async(req,res) => {
    const apiEndPoint = 'me/player'
    const room = await Rooms.findOne({host:req.sessionID})
    const body = {
        device_ids:[req.body.deviceID],
        play:true
    }

    if(room == null) {res.status(404); return}

    const host = room.host
    if(req.sessionID===host){
        await isAuthenticated(req.sessionID)
    }
    if(req.sessionID === host || room.usersCanPlayPause){
        callSpotifyApi(apiEndPoint,req.sessionID,'PUT',body)
    }
    res.status(200).json({message:'success'})

})

router.put('/pause',async (req,res) => {
    const apiEndPoint = 'me/player/pause'
    const room = await Rooms.findOne({code:req.body.code})
    if(room == null){res.status(404);return}

    const host = room.host
    if(req.sessionID===host){
        await isAuthenticated(req.sessionID)
    }
    if(req.sessionID === host || room.usersCanPlayPause){
        await callSpotifyApi(apiEndPoint,host,'PUT')
    }
    res.status(200).json({message:'success'})
})

router.post('/skip',async (req,res) => {
    const apiEndPoint = 'me/player/next'
    const room = await Rooms.findOne({code:req.body.code})
    if(room == null){res.status(404);return}
    //check if the user already voted
    //check if the required votes to skip have been met
    //if the host skips the song reset the votes
    //make sure the same user can't skip twice
    if(req.session.voted===undefined || req.session.voted === false){
        req.session.voted=true;
        room.currentVotes++;
    }else if(req.session.voted===true){
        req.session.voted=false;
        if(room.currentVotes > 0)
            room.currentVotes--;
    }


    const host = room.host
    if(req.sessionID===host){
        await isAuthenticated(req.sessionID)
    }
    if(req.sessionID === host || room.currentVotes >= room.votesToSkip){
        room.currentVotes=0;
        callSpotifyApi(apiEndPoint,host,'POST')
        updateSongQueue(req.body.code,host)
    }   

    room.save();
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
    if(room == null){res.status(404).json({message:'not found'});return}

    if(req.sessionID===room.host){
        isAuthenticated(req.sessionID)
    }

    const host = room.host
    const response = await callSpotifyApi(apiEndPoint,host,'GET')
    updateSongQueue(req.body.code,host)
    
    try{
        const json = await response.json()
        res.status(200).json({song:json})
    }catch(err){
        res.status(204).json({song:err})
    }
})

router.get('/getAvailableDevices',async(req,res)=>{
    const apiEndPoint = 'me/player/devices'
    const room = await Rooms.findOne({host:req.sessionID})

    if(room === null){
        res.status(404).json({message:'not found'})
        return
    }

    try{
        const response = await callSpotifyApi(apiEndPoint,req.sessionID,'GET')
        const data = await response.json()
        res.status(200).json({devices:data.devices})
    }catch(err){
        res.status(501).json({message:err})
    }
    
})

router.post('/searchSpotify',async(req,res)=>{
    const q = req.body.query.split(' ').join('%20')
    const type= req.body.type.split(' ').join('%2C')
    const code = req.body.code

    const room = await Rooms.findOne({code:code})
    const host = room.host
    if(req.sessionID===host){
       await isAuthenticated(req.sessionID)
    }

    const tokens = await Tokens.findOne({user:host})
    const url =`https://api.spotify.com/v1/search?q=${q}&type=${type}`
    console.log(url)

    try{

        const response = await fetch(url,{
            headers:{
                Authorization:'Bearer ' + tokens.access_token,
                'Content-Type':'application/json',
                'Accept':'application/json' 
            }
        })
        const data = await response.json()
        res.status(200).json(data)
    }catch(err){
        res.status(501).json({message:err})
    }
        
})

router.post('/addToQueue', async (req,res)=>{
    const code = req.body.code
    const uri = req.body.uri

    const room = await Rooms.findOne({code:code})
    const host = room.host
    if(req.sessionID===host){
       await isAuthenticated(req.sessionID)
    }

    const tokens = await Tokens.findOne({user:host})
    const url =`https://api.spotify.com/v1/me/player/queue?uri=${uri}`

    try{

        const response = await fetch(url,{
            method:'POST',
            headers:{
                Authorization:'Bearer ' + tokens.access_token,
                'Content-Type':'application/json',
                'Accept':'application/json' 
            }
        })
        res.status(200).json({message:'success'})
    }catch(err){
        res.status(501).json({message:err})
    }
       
})
module.exports = router