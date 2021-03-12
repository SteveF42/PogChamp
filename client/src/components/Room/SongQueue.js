import { Button } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { useTransition, animated,useSpring } from 'react-spring'
import {useState} from 'react'
import Song from './Song'

const SongQueue = ({ changeSearchView, songQueue }) => {
    const [bounce, setBounce] = useState(false)

    const queueAnimation = useTransition(songQueue, item => item._id, {
        from: { transform: 'translate3d(0,120px,0) scale(0)', opacity: 0 },
        enter: item => async (next, cancel) => {
            await next({ transform: 'translate3d(0,0,0) scale(1)', opacity: 1 })
        },
        leave: item => async (next, cancel) => { await next({ transform: 'translate3d(0,-25px,0) scale(1)', opacity: 0, position:'absolute'})},
        trail: 75,
    })
    const bounceUp = useSpring({
        from: {transform:"translate3d(0,0,0)"},
        to:{transform: bounce ? 'translate3d(0,-64,0)' : ''}
    })
    const clickEvent = e =>{
        changeSearchView(e)
        setBounce(false)
        setBounce(true)
    }

    return (

        <div className="songQueue">
            <Button onClick={changeSearchView} style={{ color: 'white' }} startIcon={<Add />} >Add Song</Button>
            {queueAnimation.map(({ item, key, props }) => {
                return (
                    <animated.div key={key} style={bounceUp, props}>
                        <Song bandaid={true}
                            key={item._id}
                            artists={item.artists}
                            songName={item.songName}
                            imgSrc={item.imgSrc}
                            songLength={item.songLength}
                            dimensions={{ height: 64, width: 64 }}
                            context_uri={item.context_uri}
                            trackNumber={item.trackNumber}
                            displayButtons={false} />
                    </animated.div>
                )
            })}
            {songQueue.length <= 0 &&
                <p>No songs in queue</p>
            }
        </div>
    )
}

export default SongQueue