import {useState} from 'react'
import {Checkbox,FormControlLabel,withStyles} from '@material-ui/core'
import {green} from '@material-ui/core/colors'
import {BlueButton} from '../Buttons'

const CustomCheckBox = withStyles({
    root: {
        color: green[400],

    }
})(Checkbox)

const PopUp = ({usersCanSkip,usersCanQueue,usersCanPlayPause,hidePopUp}) => {
    const [canPlayPause, setCanPlayPause] = useState(usersCanPlayPause)
    const [canQueue, setCanQueue] = useState(usersCanQueue)
    const [canSkip, setCanSkip] = useState(usersCanSkip)

    const onClick= async(e) => {
        //update the room info
        const response = await fetch('/api/updateRoom',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usersCanPlayPause:canPlayPause,
                usersCanQueue:canQueue,
                usersCanSkip:canSkip
            })
        })
        hidePopUp(e)
    }

    return (
        <div className="popUp" onClick={hidePopUp}>
            <div className="popUpContent">
            
            <FormControlLabel control={<CustomCheckBox color="default" checked={canPlayPause} onChange={()=>setCanPlayPause(!canPlayPause)}/>} label="Allow users to play/pause"/>
            <FormControlLabel control={<CustomCheckBox color="default" checked={canSkip}  onChange={()=>setCanSkip(!canSkip)}/>} label="Allow users to skip"/>
            <FormControlLabel control={<CustomCheckBox color="default" checked={canQueue} onChange={()=>setCanQueue(!canQueue)}/>} label="Allow users to queue music"/>
            <div className="updateRoomButton">
                <BlueButton className="roomUpdate" onClick={onClick}>Update Room</BlueButton>
            </div>
            </div>
        </div>
    )
}

export default PopUp
