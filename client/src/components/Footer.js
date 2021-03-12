/* 
    filename: Footer.js
    description: Footer component, contains information
*/

import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <footer className="layout-footer">
            <div className="footer-info">
                <a href='/'> Terms of use </a>
                <a href='/'> Privacy Policy </a>
                <a href='https://github.com/SteveF42/PogChamp'> GitHub </a>
            </div>
            <span>
                <p>Spotify is copyright Spotify AB and is not affiliated with PogChamp</p>
            </span>
        </footer>
    )
}

export default Footer
