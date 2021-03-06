/*
    FileName: AuthCallback.js
    description: only used to receieve a call back after logging into spotify
        clears the window history to hide the codes receieved
*/

import {useEffect} from 'react'

const AuthCallback = () => {

    useEffect(() => {
        //parse url params
        const callback = async ()=>{

            const urlParams = new URLSearchParams(window.location.search);
            
            if(urlParams.has('code')){
                const res = await fetch('/spotify/callback',{
                    method:'POST',
                    credentials:'include',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({
                        code:urlParams.get('code')
                    })
                })
                if(res.status===200){
                    window.history.replaceState(null,null,'/host')
                    window.location = '/host'
                }
            }else if(urlParams.has('error')){
                window.history.go(-2)
            }
        }
        callback()        
    }, [])
    
    return (null)
}

export default AuthCallback
