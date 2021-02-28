import { useState, useEffect } from 'react'
import { Button, LinearProgress } from '@material-ui/core'
import { Pause, PlayArrow, SkipNext } from '@material-ui/icons'


const MusicPlayer = ({ currentSong, playSong, pauseSong, skipSong, roomInfo }) => {
    const [isPlaying, setIsPlaying] = useState(true)
    const playOrPause = async () => {
        isPlaying ? pauseSong() : playSong();
        setIsPlaying(!isPlaying)
    }

    const styles = {
        playPause: {
            color: (roomInfo.usersCanPlayPause || roomInfo.isHost) ? 'white' : 'grey'
        },
        skip: {
            color: (roomInfo.usersCanSkip || roomInfo.isHost) ? 'white' : 'grey'
        }
    }
    return (
        <>
            {currentSong != null &&
                <div className="musicPlayer">
                    <div className="image">
                        <img src={currentSong.item.album.images[1].url} height="200" width="200" alt="none" placeholder="img"></img>
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
                                    <Button disabled={!(roomInfo.usersCanPlayPause || roomInfo.isHost)} onClick={playOrPause} startIcon={isPlaying ? <Pause style={styles.playPause} /> : <PlayArrow style={styles.playPause} />} />
                                </div>
                                <div className="skip">
                                    <Button disabled={!(roomInfo.usersCanSkip || roomInfo.isHost)} startIcon={<SkipNext style={styles.skip} />} onClick={() => { skipSong(); setIsPlaying(true) }} />
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
