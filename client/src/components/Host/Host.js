import React from 'react'
import { useState, useEffect } from 'react'
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core'
import './Host.css'
import { GreenButton, BlueButton } from '../Buttons'

const TextStyled = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: green[400],
            },
            '&.Mui-focused fieldset': {
                borderColor: green[400],
            }
        },
        '& .MuiFormLabel-root': {
            color: 'grey'
        },
        '& .MuiInputBase-root': {
            color: 'white'
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: green[400],

        }
    }
})(TextField)

const CustomCheckBox = withStyles({
    root: {
        color: green[400],

    }
})(Checkbox)



const Host = () => {
    const [session, setSession] = useState(null)
    const [allowQueue, setAllowQueue] = useState(false)
    const [allowSkip, setAllowSkip] = useState(false)
    const [allowPlayPause, setAllowPlayPause] = useState(false)
    const [votesToSkip, setVotesToSkip] = useState(1)


    useEffect(() => {
        const getRoom = async () => {
            const response = await fetch('/api/createRoom', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            const data = await response.json()
            setSession(data.room)
        }
        getRoom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //gets spotify redirect url
    const getSpotifyLogin = async () => {
        const getSpotifyLogin = await fetch('/spotify/getAuthUrl', { credentials: 'include' })
        const spotifyLogin = await getSpotifyLogin.json()
        window.location.assign(spotifyLogin.url)
    }

    const createRoom = async () => {
        //sends a request to the server to create a new room
        const isAuthenticated = await fetch('/spotify/isAuthenticated', {
            credentials: 'include'
        })
        const authData = await isAuthenticated.json()

        console.log(authData)

        //if something went wrong and the user isn't logged in or user tokens are invalid they'll need to login
        if (!authData.authenticated) {
            getSpotifyLogin()
        } else {
        //if not then just create a room and send them to it
            const data = {
                votesToSkip:votesToSkip,
                usersCanQueue: allowQueue,
                usersCanPlayPause: allowPlayPause,
                usersCanSkip: allowSkip,
                override: session != null
            }

            const res = await fetch('/api/createRoom', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const json = await res.json()
            console.log(json.Room)
            window.localStorage.setItem('code',json.Room.code)
            window.location.href = `/room/${json.Room.code}`
        }
    }
    //shows that the user already has an active session going 
    const returnToRoom = async () => {
        //redirect user back to old room 
        const isAuthenticated = await fetch('/spotify/isAuthenticated', {
            credentials: 'include'
        })
        const data = await isAuthenticated.json()
        if(!data.authenticated){
            getSpotifyLogin()
        }else{       
            window.localStorage.setItem('code',session.code)
            window.location = `/room/${session.code}`
        }
    }


    return (
        <div className='container'>
            <div className="select-options">
                <div className="rejoin-room">
                    {session != null && <BlueButton variant="contained" color="secondary" size="large" onClick={returnToRoom}>Re-Join: {session.code}</BlueButton>}
                </div>

                <GreenButton variant="contained" color="primary" size="large" onClick={createRoom}> Create New Room </GreenButton>
                <div className="create-new-room">
                    <TextStyled onChange={(e) => setVotesToSkip(e.target.value)} variant="outlined" defaultValue={votesToSkip} required={true} type="number" label="Vote required to skip" inputProps={{ style: { textAlign: 'center' } }} />
                    <div>
                        <div className="options">
                            <FormControlLabel
                                control={<CustomCheckBox color="default" onClick={() => setAllowQueue(!allowQueue)} />}
                                label="Allow users to queue music"
                            />
                            <FormControlLabel
                                control={<CustomCheckBox color="default" onClick={() => setAllowSkip(!allowSkip)} />}
                                label="Allow users to skip songs"
                            />
                            <FormControlLabel
                                control={<CustomCheckBox color="default" onClick={() => setAllowPlayPause(!allowPlayPause)} />}
                                label="Allow users to Play/Pause music"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Host
