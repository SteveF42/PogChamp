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

const callSpotifyApi = async (endpoint, hostSession, method) => {
    const token = await Tokens.findOne({ user: hostSession })
    const url = 'https://api.spotify.com/v1/' + endpoint
    const response = await fetch(url, {
        method: method,
        headers: {
            Authorization: 'Bearer ' + token.access_token
        },
    })

    return response
}

module.exports = { refreshTokens, isAuthenticated, updateOrCreateTokens, callSpotifyApi }