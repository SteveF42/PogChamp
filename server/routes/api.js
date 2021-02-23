const router = require('express').Router()
const Rooms = require('../database/Models/room')
const randomCode = require('random-key')


router.post('/createRoom', async(req,res) => {
    try{
        const RoomFound = await Rooms.findOne({"host": req.session.id})
        
        //if a current user doesn't have a session going on, create a room
        if(RoomFound==null){
            const newRoom = new Rooms({
                code: randomCode.generate(5).toUpperCase(),
                host: req.session.id,
                votesToSkip: req.body.votesToSkip,
                usersCanQueue: req.body.usersCanQueue,
                usersCanSkip: req.body.usersCanSkip
            })
            const savedRoom = await newRoom.save()
            res.status(201).json({Room:savedRoom})
            console.log(savedRoom)

        //otherwise give a response that lets the user know that they already have a current room 
        }else{
            if(req.body.override==true){
                RoomFound.delete()
                const newRoom = new Rooms({
                    code: randomCode.generate(5).toUpperCase(),
                    host: req.session.id,
                    votesToSkip: req.body.votesToSkip,
                    usersCanQueue: req.body.usersCanQueue,
                    usersCanSkip: req.body.usersCanSkip
                })
                const savedRoom = await newRoom.save()
                res.status(201).json({Room: savedRoom})
            }else{
                res.status(200).json({Room: RoomFound})
            }
        }
    }catch(err){
        res.status(500).json({error:err})
        console.log(err)
    }
        
})

router.get('/createRoom', async(req,res) => {
    try {
        const room = await Rooms.findOne({'host' : req.session.id})
        console.log(req.session.id)

        res.status(200).json({room:room})
    } catch (error) {
        res.status(500).json({error:err})
    }
})

router.get('/:id',(req,res) => {

})
module.exports = router