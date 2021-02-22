import React from 'react'
import './Home.css'
import { Button } from '@material-ui/core/'
import {Headset, PlayArrowOutlined} from '@material-ui/icons'

const Home = () => {
    return (
        <div className="home-select-screen">
            <div className="header-home" >
                <span>
                    logo
                </span>
                <h1 style={{fontSize:'3rem',fontWeight:'400'}}>POGIFY!!</h1>
            </div>

            <p className="details">Select a room to join or host your own! 'requires spotify premium' </p>

            <div className="button-select">
                <div className='btn-group'>
                    <Button 
                        startIcon={<PlayArrowOutlined style={{fontSize:'40px'}}/>}
                        variant="contained"
                        color="primary"
                        style={{ borderRadius: '30px', fontSize:'15px',fontWeight:'700'}}
                        size="large"
                        href="/join"
                    >
                        Join
                </Button>
                </div>
                <div className='btn-group'>
                    <Button 
                        startIcon ={<Headset style={{fontSize:'35px'}}/>}
                        variant="contained"
                        color="secondary"
                        style={{ borderRadius: '30px', fontSize:'15px',fontWeight:'700'}}
                        size="large"
                        href="/host">
                        Host Room
                </Button>
                </div>
            </div>
        </div>
    )
}

export default Home