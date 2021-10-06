/* 
    filename: Join.js 
    description: Allows user to input code and join a room
*/
import { useState } from 'react'
import { TextField, withStyles, FormHelperText } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { GreenButton } from '../Buttons'
import './Join.css'

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
            color: 'grey'
        },
        '& .MuiInputBase-root': {
            color: 'white'
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: green[400],
        }
    }
})(TextField)


const Create = () => {
    const [error, setError] = useState(false)
    const [helperText, setHelperText] = useState('')
    const [code, setCode] = useState('')
    const [password,setPassword] = useState('')

    const onRoomJoin = async (e) => {
        console.log(code)
        const data = {code,password}
        // const res = await fetch(`/api/getRoom/${code}`)
        const res = await fetch('/api/checkPassword',{
            method:"POST",
            credentials:"include",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if (res.status === 404) {
            setError(true)
            setHelperText('invalid room code/password')
            e.target.value=''
        }
        if(res.status===200){
            window.localStorage.setItem('code',code)
            window.location = `/room/${code}`
        }
    }

    return (
        <div className="container join-container">
            <TextStyled style={{padding:'0 0 15px 0'}} error={error} variant="outlined" label="Input Room Code" value={code} onChange={(e)=>setCode(e.target.value.toUpperCase())}/>
            <TextStyled style={{padding:'0 0 0 0'}} error={error} variant="outlined" label="Input Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            
            <FormHelperText error={error}>{helperText}</FormHelperText>
            <div className="bottom">
                <GreenButton onClick={onRoomJoin} size="large" className="btn">JOIN</GreenButton>
            </div>
        </div>
    )
}

export default Create
