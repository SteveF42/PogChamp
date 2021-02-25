import React from 'react'
import { Button, LinearProgress } from '@material-ui/core'
import { Pause, PlayArrow, SkipNext } from '@material-ui/icons'
import propTypes from 'prop-types'


const MusicPlayer = ({ currentSong,playSong,pauseSong }) => {
    return (
        <>
            {currentSong !== '' &&
                <div className="musicPlayer">
                    <div className="image">
                        {currentSong !== '' && <img src={currentSong.item.album.images[1].url} height="200" width="200"></img>}
                    </div>
                    <div className="rightHalf">
                        <div className="songInfo">
                            <h3 className="songTitle">
                                {currentSong.item.name}
                            </h3>
                            <div className="songArtists">
                                {currentSong.item.artists.map(obj => <p className="artists" key={obj.id}>{obj.name}</p>)}
                            </div>
                        </div>
                        <div className="audioController">
                            <div className='trackButtons'>
                                <div className="pauseOrPlay">
                                    <Button onClick={() => currentSong.is_playing ? pauseSong() : playSong()} startIcon={currentSong.is_playing ? <Pause /> : <PlayArrow />} />
                                </div>
                                <div className="skip">
                                    <Button startIcon={<SkipNext />} />
                                </div>
                            </div>
                            <div className="trackProgress">
                                <LinearProgress variant="determinate" value={(currentSong.progress_ms / currentSong.item.duration_ms) * 100}></LinearProgress>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default MusicPlayer
