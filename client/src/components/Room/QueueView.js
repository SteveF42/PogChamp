import { useState, useEffect } from 'react'
import { TextField, Button } from '@material-ui/core'
import { Add, ArrowBack } from '@material-ui/icons'
import { GreenButton } from '../Buttons'
import Song from './Song'

const QueueView = ({ Queue, code }) => {
    //map of objects to be filled from songs from spotify
    const [songQueue, setSongQueue] = useState(Queue === undefined ? [] : [...Queue])
    const [searchItems, setSearchItems] = useState(JSON.parse(window.localStorage.getItem('songSearch')) || [])
    const [queryParams, setQueryParams] = useState('')
    const [searchView, setSearchView] = useState(true)


    useEffect(() => {
        if(Queue!==undefined){
            setSongQueue([...Queue])
            console.log(songQueue)
        }

        // eslint-disable-next-line
    }, [Queue])




    const searchSong = async () => {
        console.log(queryParams)
        const response = await fetch('/spotify/searchSpotify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: queryParams,
                code,
                type: 'track'
            })
        })
        const data = await response.json()
        if(data.tracks!==undefined){
            setSearchItems([...data.tracks.items])
            window.localStorage.setItem('songSearch',[JSON.stringify(data.tracks.items)])
        }
    }

    return (
        <>
            {searchView ?
                <div className="songQueue">
                    <Button onClick={()=>setSearchView(!searchView)} style={{color:'white'}} startIcon={<Add />} >Add Song</Button>
                    {songQueue.map(item => {
                        return (
                            <Song bandaid={true} key={item._id} artists={item.artists} songName={item.songName} imgSrc={item.imgSrc} songLength={item.songLength} dimensions={{ height: 64, width: 64 }} context_uri={item.context_uri} trackNumber={item.trackNumber} displayButtons={false}/>
                        )
                    })}
                    {songQueue.length <= 0 &&
                        <p>No songs in queue</p>
                    }
                </div>
                :
                <div className="searchSong">
                    <div className="searchInput">
                        <Button onClick={()=>setSearchView(!searchView)} startIcon={<ArrowBack/>}>back</Button>
                        <TextField label="Search" onChange={(e) => setQueryParams(e.target.value)} />
                        <GreenButton onClick={searchSong}>Submit</GreenButton>
                    </div>
                    <div className="searchItems">
                        {searchItems.map(item => {
                            return (
                                <Song key={item.id} artists={item.artists} songName={item.name} imgSrc={item.album.images[2].url} songLength={item.duration_ms} dimensions={{ height: 64, width: 64 }} context_uri={item.album.uri} trackNumber={item.track_number} spotifyTrack={item.uri} displayButtons={true}/>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    )
}

export default QueueView
