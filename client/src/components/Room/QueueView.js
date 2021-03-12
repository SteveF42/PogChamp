import { useState, useEffect } from 'react'
import { TextField, Button } from '@material-ui/core'
import { Add, ArrowBack } from '@material-ui/icons'
import { GreenButton } from '../Buttons'
import { useTransition, animated } from 'react-spring'
import SearchSong from './SearchSong'
import SongQueue from './SongQueue'
import Song from './Song'

const QueueView = ({ Queue, code }) => {
    //map of objects to be filled from songs from spotify
    const [songQueue, setSongQueue] = useState(Queue === undefined ? [] : [...Queue])
    const [searchItems, setSearchItems] = useState(JSON.parse(window.localStorage.getItem('songSearch')) || [])
    const [queryParams, setQueryParams] = useState('')
    const [searchView, setSearchView] = useState(true)


    useEffect(() => {
        if (Queue !== undefined) {
            setSongQueue([...Queue])
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
        if (data.tracks !== undefined) {
            setSearchItems([...data.tracks.items])
            window.localStorage.setItem('songSearch', [JSON.stringify(data.tracks.items)])
        }
    }

    const changeSearchView = ()=>{
        setSearchView(!searchView)
    }
    const updateQuaryParams = (e)=>{
        setQueryParams(e.target.value)
    }

    return (
        <>

            {searchView ?
                <SongQueue changeSearchView={changeSearchView} songQueue={songQueue}/>
                :
                <SearchSong searchItems={searchItems} changeSearchView={changeSearchView} setQuaryParams={updateQuaryParams} searchSong={searchSong}/>
            }
        </>
    )
}

export default QueueView
