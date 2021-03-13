/* 
    filename: SearchSong.js
    description: Allows user to search spotify API for songs
*/

import { TextField, Button } from '@material-ui/core'
import {  ArrowBack } from '@material-ui/icons'
import { GreenButton } from '../Buttons'
import { useTransition, animated } from 'react-spring'
import socketIOClient from 'socket.io-client'
import {useEffect,useState} from 'react'
import Song from './Song'

const SearchComponent = ({searchItems, changeSearchView,setQuaryParams,searchSong}) => {
    const [IO, setIO] = useState('')

    
    const searchAnimation = useTransition(searchItems, item => item.id, {
        from: { transform: 'translate3d(0,120px,0) scale(0)', opacity: 0 },
        enter: item => async (next, cancel) => {
            await next({ transform: 'translate3d(0,0,0) scale(1)', opacity: 1 })
        },
        leave: { display: 'none' },
        trail: 125,
    })


    useEffect(() => {
        const socket = socketIOClient('',{withCredentials:true})

        setIO(socket)
        socket.emit('joinRoom',window.localStorage.getItem('code'))
        return () => {
            socket.disconnect()
        }
    }, [])

    const playEvent = ()=>{
        IO.emit('play',window.localStorage.getItem('code'))
    }

    return (
        <div className="searchSong">
            <div className="searchInput">
                <Button onClick={changeSearchView} startIcon={<ArrowBack />}>back</Button>
                <TextField label="Search" onChange={setQuaryParams} />
                <GreenButton onClick={searchSong}>Submit</GreenButton>
            </div>
            <div className="searchItems">
                {searchAnimation.map(({ item, key, props }) => {
                    return (
                        <animated.div key={key} style={props} >
                            <Song
                                key={item.id}
                                artists={item.artists}
                                songName={item.name}
                                imgSrc={item.album.images[2].url}
                                songLength={item.duration_ms}
                                dimensions={{ height: 64, width: 64 }}
                                context_uri={item.album.uri}
                                trackNumber={item.track_number}
                                spotifyTrack={item.uri}
                                displayButtons={true} 
                                playEvent={playEvent}
                                />
                        </animated.div>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchComponent