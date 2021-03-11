//pauses the song
export const pauseSong = async (code) => {
    console.log('pause')

    const res = await fetch('/spotify/pause', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code
        })
    })
    if (res.status !== 200) {
        console.log(res)
    }
}

//resumes playback
export const playSong = async (code,params = {context_uri:'',offset:0}) => {
    console.log('play')

    const res = await fetch('/spotify/play', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            context_uri: params.context_uri,
            offset:{
                position: params.offset
            }
        })
    })
    if (res.status !== 200) {
        console.log(res)
    }
}

export const skipSong = async (code,voted=false) => {
    console.log('skip')

    const res = await fetch('/spotify/skip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code,
            voted
        })
    })
    if (res.status !== 200) {
        console.log(res)
    }
}