/* 
    filename: Room.js
    description: main room component that allows users to join
*/

import { useMeasure } from 'react-use'
import { useEffect, useState } from 'react'
import React from 'react'
import { Switch, FormControlLabel } from '@material-ui/core'
import { FadeMenu, BlueButton } from '../Buttons'
import { Transition } from 'react-spring/renderprops'
import { useSpring, animated } from 'react-spring'
import MusicPlayer from './MusicPlayer'
import PopUp from './PopUp'
import QueueView from './QueueView'
import { pauseSong, playSong, skipSong } from './utils'
import socketIOClient from 'socket.io-client'
import './Room.css'

const Room = () => {
    const code = window.localStorage.getItem('code') || window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
    const [clientSocket, setClientSocket] = useState('')
    const [timerID, setTimerID] = useState('')
    const [availableDevices, setAvailableDevices] = useState()
    const [displayPopUp, setDisplayPopUp] = useState(false)
    const [currentSong, setCurrentSong] = useState()
    const [view, setView] = useState(false)
    const [roomInfo, setRoomInfo] = useState({ isHost: false })
    const [contentHeight, setContentHeight] = useState(0)
    const [musicViewHeight, setMusicViewHeight] = useState(0)
    const [queueRef, queueHeight] = useMeasure()
    const [musicRef, musicHeight] = useMeasure()

    const containerResize = useSpring({
        to: { height: view ? contentHeight : musicViewHeight }
    })


    //when component mounts, it sets a timer to poll with the server
    useEffect(() => {
        //joins socket on mount
        const socket = socketIOClient('',{withCredentials:true})

        console.log(socket)
        setClientSocket(socket)
        socket.emit('joinRoom',code)
        socket.on('currentSong',currentSong=>{
            setCurrentSong(currentSong)
        })
        socket.on('roomInfo',roomInfo=>{
            setRoomInfo(roomInfo)
        })

        window.localStorage.setItem('code', code)
        getCurrentSong()
        getRoomInfo().then((roomInfo) => {
            if (roomInfo.isHost) {
                getAvailableDevices()
                //makes sure only host can get the current song
                const ID = setInterval(() => {
                    getCurrentSong().then(songInfo=>{
                        if(songInfo!==undefined)
                            socket.emit('shareCurrentSong',songInfo,code)
                    })
                    getRoomInfo().then(roomInfo=>{
                        if(roomInfo!==undefined)
                            socket.emit('shareRoomInfo',roomInfo,code)
                    })
                }, 2500)
                setTimerID(ID)
            } else {
                setAvailableDevices({ isHost: false })
            }    
        })

        //keeps a constant poll to the server
        return () => {
            clearInterval(timerID)
            socket.disconnect();
            //if the host leaves then clean up the queue
            fetch('/api/clearQueue', { method: 'PUT' }).then(res=>{})
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setContentHeight(queueHeight.height)
        setMusicViewHeight(musicHeight.height)
    }, [queueHeight, musicHeight])

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
                return data.song
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
            <Transition keys={displayPopUp} items={displayPopUp} from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }} config={{duration:200}}>
                {(displayPopUp) => displayPopUp && ((props) => (
                            <PopUp
                                props={props}
                                hidePopUp={hidePopUp}
                                usersCanPlayPause={roomInfo.usersCanPlayPause}
                                usersCanQueue={roomInfo.usersCanQueue}
                                usersCanSkip={roomInfo.usersCanSkip}
                                votesToSkip={roomInfo.votesToSkip} />
                    ))}
            </Transition>
            <div className="roomContainer">

                <div className="topHalf">
                    <div className="topItems">
                        <span className="roomCode">
                            <h3 style={{ fontSize: "1.58rem" }}>Code: {window.localStorage.getItem('code')}</h3>
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
                                label={<p className="playAnimation" style={{ margin: '0' }}> {view ? 'Queue' : 'Music'}</p>}
                            />
                        </div>
                    </div>



                    <animated.div className="musicContainer" style={containerResize}>
                        {/* switches between the music view or the queue view */}
                        <Transition
                            items={view}
                            from={{ opacity: 0 }}
                            enter={{ opacity: 1 }}
                            leave={{ display: 'none' }}
                            delay={200}
                            config={{ duration: 700 }}
                        >
                            {(view) => (
                                !view
                                    ? props =>
                                        <div style={props} ref={musicRef}>
                                            <MusicPlayer code={code} roomInfo={roomInfo} currentSong={currentSong} pauseSong={() => pauseSong(code)} playSong={() => playSong(code)} skipSong={skipSong} />
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
                                        </div>

                                    : props =>
                                        <div style={props} ref={queueRef}>
                                            <QueueView Queue={roomInfo.songQueue} code={code} />
                                        </div>
                            )}
                        </Transition>
                    </animated.div>
                </div>
                <div className="bottomHalf">

                </div>
            </div>
        </>
    )

}

export default Room
