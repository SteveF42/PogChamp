import { useEffect, useState } from 'react'
import './Room.css'
import { Switch, FormControlLabel } from '@material-ui/core'
import MusicPlayer from './MusicPlayer'
import PopUp from './PopUp'
import { FadeMenu, BlueButton } from '../Buttons'

const Room = () => {
    const code = window.localStorage.getItem('code') || window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
    const [availableDevices, setAvailableDevices] = useState()
    const [displayPopUp, setDisplayPopUp] = useState(false)
    const [currentSong, setCurrentSong] = useState()
    const [view, setView] = useState(false)
    const [roomInfo, setRoomInfo] = useState({ isHost: false })

    //when component mounts, it sets a timer to poll with the server
    useEffect(() => {

        getCurrentSong()
        getRoomInfo().then((roomInfo) => {
            if (roomInfo.isHost) {
                getAvailableDevices()
            } else {
                setAvailableDevices({ isHost: false })
            }
        })

        //keeps a constant poll to the server
        const timerID = setInterval(() => {
            getCurrentSong()
            getRoomInfo()
        }, 5000)

        return () => {
            clearInterval(timerID)
        }
        // eslint-disable-next-line
    }, [])

    //logs the currentSong which causes a page reload
    useEffect(() => {
        // console.log(currentSong)
        // console.log(roomInfo)
        // console.log(availableDevices);
        // console.log(currentSong.item.album.images[0].url)
    }, [currentSong, roomInfo, availableDevices])


    const getAvailableDevices = async () => {
        const res = await fetch(`/spotify/getAvailableDevices`)
        const data = await res.json()
        if (res.status === 200) {
            setAvailableDevices({ ...data, isHost: true })
        }
    }

    //gets the roomInfo for other users
    const getRoomInfo = async () => {
        const res = await fetch(`/api/getRoom/${code}`)
        const data = await res.json()
        if (res.status === 200) {
            setRoomInfo(data.roomInfo)
            return data.roomInfo
        }
    }

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
            console.log('No Current song playing')
            return
            //access token expired
        } else if (res.status === 401) {
            console.log('access denied')
            return
        }

        const data = await res.json()
        if (currentSong === undefined || currentSong.item !== data.song.item) {
            if (data.song !== null && data.song.item != null) {
                setCurrentSong(data.song)
            }
        }
    }

    //pauses the song
    const pauseSong = async () => {
        console.log('pause')

        const res = await fetch('/spotify/pause', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code
            })
        })
        if (res.status !== 200) {
            console.log(res)
        }
    }

    //resumes playback
    const playSong = async () => {
        console.log('play')

        const res = await fetch('/spotify/play', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
            })
        })
        if (res.status !== 200) {
            console.log(res)
        }
    }

    const skipSong = async () => {
        console.log('skip')

        const res = await fetch('/spotify/skip', {
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
        }
    }
    const playAnimation = () => {
        const elements = document.getElementsByClassName('attachAnimation')
        for(let item of elements){
            item.classList.remove('playAnimation')
            void item.offsetWidth
            item.classList.add('playAnimation')
        }
    }

    //lets the user choose a different device to output from
    const startPlaybackOnDevice = async (e) => {
        const deviceID = e.target.id
        if (deviceID === '') return
        const body = {
            deviceID
        }
        console.log(body);
        const res = await fetch('/spotify/playNewDevice', {
            method: "PUT",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(body)
        })
        console.log(res);
        if (currentSong == null || currentSong.is_playing === false) {
            playSong()
            getCurrentSong()
        }
    }
    const hidePopUp = (e) => {
        const className = e.target.className
        if(className === 'popUp'|| className==='MuiButton-label'){
            setDisplayPopUp(!displayPopUp)
        }
    }

    return (
        <>
            {displayPopUp && <PopUp hidePopUp={hidePopUp} usersCanPlayPause={roomInfo.usersCanPlayPause} usersCanQueue={roomInfo.usersCanQueue} usersCanSkip={roomInfo.usersCanSkip}/>}
            <div className="roomContainer">

                <div className="topHalf">
                    <div className="topItems">
                        <span className="roomCode">
                            <h3>Code: {window.localStorage.getItem('code')}</h3>
                        </span>
                        <div className="queueSwitch">
                            <FormControlLabel
                            labelPlacement="top"
                                control={
                                    <Switch
                                        size='medium'
                                        value={view}
                                        onChange={() => {
                                            setView(!view)
                                            playAnimation()
                                        }}
                                    />
                                }
                                label={<p className="attachAnimation" style={{margin:'0'}}> {view ? 'Track' :'Music'}</p>}
                            />
                        </div>
                    </div>

                    <div className="attachAnimation musicContainer">
                        {/* switches between the music view or the queue view */}
                        {!view ?
                            <MusicPlayer roomInfo={roomInfo} currentSong={currentSong} pauseSong={pauseSong} playSong={playSong} skipSong={skipSong} />
                            :
                            <p>Other</p>
                        }
                        {!view &&
                            <div className="bottomButtons">
                                {currentSong !== null &&
                                    (availableDevices !== undefined && roomInfo.isHost) &&
                                    <div className="availableDevices">
                                        <FadeMenu menuItems={availableDevices.devices} label="Listening Device" startPlaybackOnDevice={startPlaybackOnDevice}></FadeMenu>
                                    </div>
                                }
                                {roomInfo.isHost &&
                                    <div className="roomSettings">
                                        <BlueButton style={{ marginLeft: '10px' }} onClick={() => setDisplayPopUp(!displayPopUp)}>Room Settings</BlueButton>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="bottomHalf">

                </div>
            </div>
        </>
    )

}

export default Room
