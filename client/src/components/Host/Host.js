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
    const [votesToSkip, setVotesToSkip] = useState(1)


    useEffect(() => {
        const getRoom = async () => {
            const response = await fetch('/api/createRoom',{
                credentials: 'include',
                headers:{
                    'Content-Type':'application/json',
                    'Accept': 'application/json'
                }
            })
            const data = await response.json()
            setSession(data.room)
        }
        getRoom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const createRoom = async () => {
        //sends a request to the server to create a new room
        const data = {
            votesToSkip: votesToSkip,
            usersCanQueue: allowQueue,
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
        window.location.href = `/room/${json.Room.code}`
    }
    const returnToRoom = () => {
        //redirect user back to old room 
        window.location.href = `/room/${session.code}`
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
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Host
