import React from 'react'
import {TextField, withStyles} from '@material-ui/core'
import {green} from '@material-ui/core/colors'
import {GreenButton} from '../Buttons'
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
    return (
        <div className="container join-container">
            <TextStyled variant="outlined" label="Input Room Code" />
            <div className="bottom">
                <GreenButton size="large" className="btn">JOIN</GreenButton>
            </div>
        </div>
    )
}

export default Create
