import { useEffect, useState } from 'react'
import './Room.css'
import Song from './Song'
import { Switch, FormControlLabel, LinearProgress, Button } from '@material-ui/core'
import { PlayArrow, Pause, SkipNext } from '@material-ui/icons'
import MusicPlayer from './MusicPlayer'

const Room = () => {
    const [code, setCode] = useState(window.localStorage.getItem('code'))
    const [currentSong, setCurrentSong] = useState('')
    const [view, setView] = useState(false)

    useEffect(() => {
        getCurrentSong()
        const timerID = setInterval(() => {
            getCurrentSong()
        }, 1000)

        return () => {
            clearInterval(timerID)
        }
    }, [])

    useEffect(() => {
        console.log(currentSong)
        // console.log(currentSong.item.album.images[0].url)
    }, [currentSong])

    //gets the currently active song
    const getCurrentSong = async () => {
        const res = await fetch('/spotify/currentlyPlaying', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code
            })
        })

        if (res.status !== 200) {
            console.log(res)
            return
            //access token expired
        } else if (res.status === 401) {
            console.log('access denied')
        }

        const data = await res.json()
        if (currentSong.item !== data.song.item) {
            setCurrentSong(data.song)
        }
    }

    //pauses the song
    const pauseSong = async () => {
        if(!currentSong.is_playing) return;
        console.log('click')

        const res = await fetch('/spotify/pause', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code
            })
        })
    }

    //resumes playback
    const playSong = async () => {
        if(currentSong.is_playing) return;
        console.log('click')
        
        const res = await fetch('/spotify/play', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code
            })
        })
    }

    return (
        <div className="container">
            <div className="topHalf">
                <div className="topItems">
                    <span className="roomCode">
                        <h3>Code: {window.localStorage.getItem('code')}</h3>
                    </span>
                    <div className="queueSwitch">
                        <FormControlLabel
                            control={
                                <Switch
                                    size='medium'
                                    value={view}
                                    onChange={() => setView(!view)}
                                />
                            }
                            label={view ? 'View Music' : 'View Queue'}
                        />
                    </div>
                </div>
                
                <div className="musicContainer">
                    <MusicPlayer currentSong={currentSong} pauseSong={pauseSong} playSong={playSong}/>
                </div>
            </div>
            <div className="bottomHalf">

            </div>
        </div>
    )
}

export default Room
