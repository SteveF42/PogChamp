const router = require('express').Router()
const Rooms = require('../database/Models/room')
const randomCode = require('random-key')
const room = require('../database/Models/room')


router.post('/createRoom', async (req, res) => {
    try {
        const RoomFound = await Rooms.findOne({ "host": req.session.id })
        const date = new Date()
        date.setDate(date.getDate() + 1)

        //if a current user doesn't have a session going on, create a room
        if (RoomFound == null) {
            const newRoom = new Rooms({
                code: randomCode.generate(5).toUpperCase(),
                host: req.session.id,
                votesToSkip: req.body.votesToSkip,
                usersCanQueue: req.body.usersCanQueue,
                usersCanPlayPause: req.body.usersCanPlayPause,
                usersCanSkip: req.body.usersCanSkip,
                expireAt: date,
                songQueue:[]
            })
            const savedRoom = await newRoom.save()
            res.status(201).json({ Room: savedRoom })
            console.log(savedRoom)

            //otherwise give a response that lets the user know that they already have a current room 
        } else {
            if (req.body.override == true) {
                RoomFound.code = randomCode.generate(5).toUpperCase()
                RoomFound.host = req.session.id
                RoomFound.votesToSkip = req.body.votesToSkip
                RoomFound.usersCanQueue = req.body.usersCanQueue
                RoomFound.usersCanPlayPause = req.body.usersCanPlayPause
                RoomFound.usersCanSkip = req.body.usersCanSkip
                RoomFound.expireAt = date
                RoomFound.songQueue= []
                const savedRoom = await RoomFound.save()
                res.status(201).json({ Room: savedRoom })
            } else {
                res.status(200).json({ Room: RoomFound })
            }
        }
    } catch (err) {
        res.status(500).json({ error: err })
        console.log(err)
    }

})

router.get('/createRoom', async (req, res) => {
    try {
        const room = await Rooms.findOne({ 'host': req.session.id })
        // refreshes the room expiry date every time the host touches the room
        if (room != null) {
            const date = new Date()
            date.setDate(date.getDate() + 1)
            room.expireAt = date

            room.save()
        }
        res.status(200).json({ room: room })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.get('/getRoom/:code', async(req, res) => {
    const code = req.params.code
    const room = await Rooms.findOne({code:code})
    if(room == null){
        res.status(404).json({message:'Not Found'})
        return
    }
    
    const response = {
        isHost: req.sessionID === room.host,
        code: room.code,
        usersCanQueue: room.usersCanQueue,
        usersCanSkip: room.usersCanSkip,
        usersCanPlayPause:room.usersCanPlayPause,
        songQueue: room.songQueue
    }
    res.status(200).json({roomInfo:response})
})
module.exports = router

//only host can update the room
router.post('/updateRoom', async(req,res)=>{
    if(req.body.updatePermissions){

        try{
            const room = await Rooms.findOne({host:req.sessionID})
            // room.votesToSkip = req.body.votesToSkip
            room.usersCanQueue = req.body.usersCanQueue
            room.usersCanPlayPause = req.body.usersCanPlayPause
            room.usersCanSkip = req.body.usersCanSkip
            
            room.save()
            res.status(202).json({message:'accepted'})
        }catch(err){
            res.status(501).json({message:err})
        }
    }
    if(req.body.queueSong){
        const room = await Rooms.findOne({code:req.body.code})
        if(room.usersCanQueue || req.sessionID===room.host){            
            const data = {
                imgSrc: req.body.imgSrc,
                artists: req.body.artists,
                songName:req.body.songName,
                songLength:req.body.songLength,
                context_uri: req.body.context_uri,
                trackNumber: req.body.trackNumber
            }
            room.songQueue.push(data)
            room.save()
            res.status(201).json({message:'accepted'})
        }
    }
    if(req.body.updateQueue){
        const room = await Rooms.findOne({code:req.body.code})
        if(room.usersCanQueue|| req.sessionID===room.host){
            room.songQueue = req.body.newQueue
        }
        room.save()
        res.status(201).json({message:'accepted'})
    }

})

router.put('/clearQueue', async(req,res)=>{
    const room = await Rooms.findOne({host:req.sessionID})
    if(room == null){
        res.status(404)
        return
    }
    
    room.songQueue = []
    console.log('room queue cleared')
    room.save();
    res.status(202)
})