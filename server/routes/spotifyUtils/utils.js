const Tokens = require('../../database/Models/tokens')
const fetch = require('node-fetch')
const Rooms = require('../../database/Models/room')
const queryString = require('querystring')
require('dotenv')

const refreshTokens = async (tokens, sessionID) => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: queryString.stringify({
            grant_type: 'refresh_token',
            refresh_token: tokens.refresh_token,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        })
    })
    const data = await response.json()
    if(response.status == 400){
        console.log(data,response.status)
        return data
    }else{
        data['refresh_token'] = tokens.refresh_token
        updateOrCreateTokens(data, sessionID)
    }

}

const isAuthenticated = async (sessionID) => {
    const tokens = await getTokens(sessionID)
    const date = new Date()
    if (tokens != null) {
        //checks if the expiry date is up so it can be refreshed

        console.log(tokens.expires_in < date, tokens.expires_in, date)

        //if for some reason the user revoked access they'll need to login again
        if (tokens.expires_in <= date) {
            const response = await refreshTokens(tokens, sessionID)
            if(response!=null){
                return false
            }
        }
        
        return true
    }

    return false
}

const updateOrCreateTokens = async (data, sessionID) => {
    const token = await getTokens(sessionID)
    const date = new Date()
    date.setHours(date.getHours() + data.expires_in / 60 / 60)

    //creates a new token object if the user doesn't already have one
    if (token == null) {
        const Token = new Tokens({
            user: sessionID,
            access_token: data.access_token,
            token_type: data.token_type,
            scope: data.scope,
            expires_in: date,
            refresh_token: data.refresh_token
        })
        Token.save()

        //updates the users tokens 
    } else {
        token.access_token = data.access_token
        token.token_type = data.token_type
        token.scope = data.scope
        token.expires_in = date
        token.refresh_token = data.refresh_token
        token.save()
    }
}


const getTokens = async (sessionID) => {
    const token = await Tokens.findOne({ user: sessionID })
    return token
}

const callSpotifyApi = async (endpoint, hostSession, method,body={}) => {
    const token = await Tokens.findOne({ user: hostSession })
    const url = 'https://api.spotify.com/v1/' + endpoint

    let response
    if(method==='GET'){
        response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token.access_token,
                'Content-Type':'application/json'
            },
            
        })
    }else{
        response = await fetch(url, {
            method: method,
            headers: {
                Authorization: 'Bearer ' + token.access_token,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(body)
    
        })
    }

    return response
}

const updateSongQueue = async (code,hostSession)=>{
    const room = await Rooms.findOne({code:code});

    if(room.songQueue.length === 0) return;

    let songResponse = await callSpotifyApi('me/player/currently-playing',hostSession,'GET')
    let songData = await songResponse.json()
    //if the current song is the first on in the queue then we gotta pop it from the queue
    if(songData.item.name === room.songQueue[0].songName){
        room.songQueue.shift()
        room.save()
    }
}

module.exports = { refreshTokens, isAuthenticated, updateOrCreateTokens, callSpotifyApi,updateSongQueue }