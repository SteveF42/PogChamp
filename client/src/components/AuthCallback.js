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
