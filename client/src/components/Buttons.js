import React from 'react'
import { green, blue } from '@material-ui/core/colors'
import { Button, Menu, MenuItem, withStyles, Fade } from '@material-ui/core'
import { useState } from 'react'

export const FadeMenu = ({ menuItems, label, startPlaybackOnDevice}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const menu = React.createRef()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (e) => {
        setAnchorEl(null)
        startPlaybackOnDevice(e)
    }
    return (
        <>
            <GreenButton aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                {label}
            </GreenButton>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                TransitionComponent={Fade}
                ref={menu}
            >
            {menuItems!==undefined && menuItems.map(obj => <MenuItem id={obj.id} key={obj.id} onClick={handleClose}>{obj.name}</MenuItem>)}
            </Menu>
        </>
    );
}


export const GreenButton = withStyles({
    root: {
        backgroundColor: green[400],
        '&:hover': {
            backgroundColor: green[500]
        }
    }
})(Button)
export const BlueButton = withStyles({
    root: {
        backgroundColor: blue[400],
        '&:hover': {
            backgroundColor: blue[500]
        }
    }
})(Button)