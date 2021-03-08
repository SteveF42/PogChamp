import { PlayArrow, QueueMusic } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import { playSong } from './utils'

const Song = ({ bandaid = false, imgSrc, artists, songName, songLength, dimensions, context_uri, trackNumber, spotifyTrack, displayButtons }) => {

    const onSongEvent = () => {
        const params = {
            context_uri,
            offset: trackNumber - 1
        }
        playSong(window.localStorage.getItem('code'), params)
    }

    const addToQueue = async () => {
        //adds song to queue through spotify
        await fetch('/spotify/addToQueue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uri: spotifyTrack,
                code: window.localStorage.getItem('code')
            })
        })

        //adds song to queue on api
        const artistsArr = []
        for (let i of artists) {
            artistsArr.push(i.name)
        }


        await fetch('/api/updateRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                queueSong: true,
                imgSrc,
                artists: artistsArr,
                songName,
                songLength,
                context_uri,
                trackNumber,
                spotifyTrack,
                code: window.localStorage.getItem('code')
            })

        })
    }

    return (
        <div className="song">
            <div className="song_leftSide">
                {displayButtons &&
                    <>
                        <Button onClick={onSongEvent} startIcon={<PlayArrow />}></Button>
                        <Button onClick={addToQueue} startIcon={<QueueMusic />}></Button>
                    </>
                }
                <img src={imgSrc} {...dimensions} alt={'noThumbnail.jpg'}></img>
            </div>

            <div className="songDetails">
                <div className="artists">

                    <p>artists:</p>
                    {artists.map(item => {
                        return (
                            <div key={bandaid ? item : item.name} style={{width:'100%',textAlign:'center'}}>
                                {bandaid ?
                                    <p>{item}</p>
                                    :
                                    <p>{item.name}</p>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className="songName">
                    <p>Song:</p>
                    <p>{songName}</p>
                </div>
                <div className="songLength">

                    <p>Duration:</p>
                    <p>{(songLength / 1000 / 60).toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}

export default Song
