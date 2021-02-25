import React from 'react'
import './Home.css'
import { Headset, PlayArrowOutlined } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import {GreenButton, BlueButton} from '../Buttons'

const Home = () => {
    return (
        <div className="container">
            <div className="header-home" >
                <span>
                    logo
                </span>
                <h1 style={{ fontSize: '3rem', fontWeight: '400' }}>POGCHAMP!!</h1>
            </div>

            <p className="details">Select a room to join or host your own! 'requires spotify premium' </p>

            <div className="button-select">
                <div className='btn-group'>
                    <Link to='/join'>
                        <GreenButton
                            startIcon={<PlayArrowOutlined style={{ fontSize: '40px' }} />}
                            variant="contained"
                            color="primary"
                            style={{ borderRadius: '30px', fontSize: '15px', fontWeight: '700' }}
                            size="large"
                        >
                            Join
                        </GreenButton>
                    </Link>
                </div>
                <div className='btn-group'>
                    <Link to='/host'>
                        <BlueButton
                            startIcon={<Headset style={{ fontSize: '35px' }} />}
                            variant="contained"
                            color="secondary"
                            style={{ borderRadius: '30px', fontSize: '15px', fontWeight: '700' }}
                            size="large">
                            Host Room
                        </BlueButton>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home