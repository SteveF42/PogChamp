import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
    return (
        <div style={styles.header} href="/">
            <span style={styles.span}><Link to="/" style={styles.a}>Logo</Link></span>
            <h2> <Link to="/" style={styles.a}>Pogify</Link></h2>
        </div>
    )
}

const styles = {
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'white'
    },
    span: {
        paddingRight: '15px',
        paddingLeft: '100px',
    },
    a:{
        textDecoration:'none',
        color:'white',
        fontSize:'35px'
    }
}

export default Header
