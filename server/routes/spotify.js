const router = require('express').Router()
const tokens = require('../database/Models/tokens')
const fetch = require('node-fetch')
require('dotenv')
const redirect_uri = 'http://192.168.1.52:5000/spotify/callback'

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

router.get('/getAuthUrl', async (req, res) => {
    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${process.env.SPOTIFY_SCOPE}&redirect_uri=${redirect_uri}`

    res.json({ url: url })
})

router.get('/callback', async (req, res) => {
    const code = req.query.code
    const error = req.query.error
    if(error == 'access_denied'){
        res.redirect('http://localhost:3000/')
        return;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri
        }
    })
    const data = await response.json()

    if (req.session.hasValidToken == null) {
        req.session['hasValidToken'] = true
    }
    updateOrCreateTokens(data, req.session.id)

    res.redirect('http://localhost:3000/')
})

router.get('/isAuthenticated',async (req,res)=>{
    const auth = isAuthenticated(req.session.id)
    res.status(200).json({authenticated:auth})
})

const refreshTokens = async (tokens)=>{
    const response = await fetch('https://accounts.spotify.com/api/token',{
        method:'POST',
        body:{
            grant_type:'refresh_token',
            refresh_token: tokens.refresh_token 
        }
    })
    const data = await response.json()
    
    updateOrCreateTokens(data)
}

const isAuthenticated = async (sessionID) => {
    const tokens = await getTokens(sessionID)
    const date = new Date
    if(tokens!=null){
        if(tokens.expires_in <= date){
            refreshTokens(tokens)
        }
        return true
    }

    return false
}

const updateOrCreateTokens = async (data, sessionID) => {
    const token = await getTokens(sessionID)
    const date = new Date()
    date.addHours(data.expires_in / 60 / 60)
    const expires_in = date.addHours(date.getHours)
    //creates a new token object if the user doesn't already have one
    if (token == null) {
        const Token = new tokens({
            user: sessionID,
            access_token: data.access_token,
            token_type: data.token_type,
            scope: data.scope,
            expires_in: expires_in,
            refresh_token: data.refresh_token
        })
        Token.save()

        //updates the users tokens 
    } else {
        token.access_token = data.access_token,
            token.token_type = data.token_type,
            token.scope = data.scope,
            token.expires_in = expires_in,
            token.refresh_token = data.refresh_token
        token.save()
    }
}


const getTokens = async (sessionID) => {
    const token = await tokens.findOne({ user: sessionID })
    return token
}


module.exports = router