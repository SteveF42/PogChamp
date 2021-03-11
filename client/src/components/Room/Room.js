import { useEffect, useState } from 'react'
import { Switch, FormControlLabel } from '@material-ui/core'
import { FadeMenu, BlueButton } from '../Buttons'
import MusicPlayer from './MusicPlayer'
import PopUp from './PopUp'
import QueueView from './QueueView'
import {pauseSong,playSong,skipSong} from './utils'
import './Room.css'

const Room = () => {
    const code = window.localStorage.getItem('code') || window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
    const [availableDevices, setAvailableDevices] = useState()
    const [displayPopUp, setDisplayPopUp] = useState(false)
    const [currentSong, setCurrentSong] = useState()
    const [view, setView] = useState(false)
    const [roomInfo, setRoomInfo] = useState({ isHost: false })

    //when component mounts, it sets a timer to poll with the server
    useEffect(() => {
        window.localStorage.setItem('code',code)
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
            // if(roomInfo.isHost){
            //     fetch('/spotify/isAuthenticated')
            // }
        }, 2500)

        return () => {
            clearInterval(timerID)
            //if the host leaves then clean up the queue
            fetch('/api/clearQueue',{method:'PUT'})
        }
        // eslint-disable-next-line
    }, [])

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


    const playAnimation = () => {
        const elements = document.getElementsByClassName('attachAnimation')
        for (let item of elements) {
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
            playSong(code)
            getCurrentSong()
        }
    }
    const hidePopUp = (e) => {
        const className = e.target.className
        if (className === 'popUp' || className === 'MuiButton-label') {
            setDisplayPopUp(!displayPopUp)
        }
    }

    return (
        <>
            {displayPopUp && <PopUp hidePopUp={hidePopUp} usersCanPlayPause={roomInfo.usersCanPlayPause} usersCanQueue={roomInfo.usersCanQueue} usersCanSkip={roomInfo.usersCanSkip} votesToSkip={roomInfo.votesToSkip}/>}
            <div className="roomContainer">

                <div className="topHalf">
                    <div className="topItems">
                        <span className="roomCode">
                            <h3 style={{fontSize:"1.58rem"}}>Code: {window.localStorage.getItem('code')}</h3>
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
                                label={<p className="attachAnimation" style={{ margin: '0' }}> {view ? 'Queue' : 'Music'}</p>}
                            />
                        </div>
                    </div>

                    <div className="attachAnimation musicContainer">
                        {/* switches between the music view or the queue view */}
                        {!view ?
                            <MusicPlayer roomInfo={roomInfo} currentSong={currentSong} pauseSong={()=>pauseSong(code)} playSong={()=>playSong(code)} skipSong={skipSong} />
                            :
                            <QueueView Queue={roomInfo.songQueue} code={code}/>
                        }
                        {!view &&
                            <div className="bottomButtons">
                                {(availableDevices !== undefined && roomInfo.isHost) &&
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
