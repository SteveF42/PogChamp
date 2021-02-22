import React from 'react'

const Header = () => {
    return (
        <div style={styles.header} href="/">
            <span style={styles.span}><a href="/" style={styles.a}>Logo</a></span>
            <h2> <a href="/" style={styles.a}>Pogify</a></h2>
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
