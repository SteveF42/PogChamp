import {useState} from 'react'
import {TextField,Checkbox,FormControlLabel,withStyles} from '@material-ui/core'
import {green} from '@material-ui/core/colors'
import {GreenButton} from '../Buttons'

const TextStyled = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: green[400],
            },
            '&.Mui-focused fieldset': {
                borderColor: green[400],
            }
        },
        '& .MuiFormLabel-root': {
            color: 'white'
        },
        '& .MuiInputBase-root': {
            color: 'white'
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: green[400],

        }
    }
})(TextField)

const CustomCheckBox = withStyles({
    root: {
        color: green[400],

    }
})(Checkbox)

const PopUp = ({usersCanSkip,usersCanQueue,usersCanPlayPause,hidePopUp,votesToSkip}) => {
    const [canPlayPause, setCanPlayPause] = useState(usersCanPlayPause)
    const [canQueue, setCanQueue] = useState(usersCanQueue)
    const [canSkip, setCanSkip] = useState(usersCanSkip)
    const [skipVotes, setSkipVotes] = useState(votesToSkip)

    const onClick= async(e) => {
        //update the room info
        await fetch('/api/updateRoom',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usersCanPlayPause:canPlayPause,
                usersCanQueue:canQueue,
                usersCanSkip:canSkip,
                votesToSkip:skipVotes,
                updatePermissions:true
            })
        })
        hidePopUp(e)
    }

    return (
        <div className="popUp" onClick={hidePopUp}>
            <div className="popUpContent">
            <TextStyled onChange={(e) => setSkipVotes(e.target.value)} variant="outlined" defaultValue={skipVotes} required={true} type="number" label="Vote required to skip" inputProps={{ style: { textAlign: 'center' } }} />
            <FormControlLabel control={<CustomCheckBox color="default" checked={canPlayPause} onChange={()=>setCanPlayPause(!canPlayPause)}/>} label="Allow users to play/pause"/>
            <FormControlLabel control={<CustomCheckBox color="default" checked={canSkip}  onChange={()=>setCanSkip(!canSkip)}/>} label="Allow users to skip"/>
            <FormControlLabel control={<CustomCheckBox color="default" checked={canQueue} onChange={()=>setCanQueue(!canQueue)}/>} label="Allow users to queue music"/>
            <div className="updateRoomButton">
                <GreenButton className="roomUpdate" onClick={onClick}>Update Room</GreenButton>
            </div>
            </div>
        </div>
    )
}

export default PopUp
