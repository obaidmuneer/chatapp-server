import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import chatModel from './models/chatModel.mjs'

const app = express()
const port = process.env.PORT || 8080
const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
    console.log(socket.id);
    chatModel.find({}, (err, data) => {
        if (!err) {
            socket.emit('msgs', data)
        }
        else {
            console.log(err);
        }
    })

    socket.on('send-msg', async (data) => {
        try {
            let savedData = await chatModel.create({
                name: data.name,
                msg: data.message
            })
            io.emit('recieve-msg', savedData)
            if (data.message === 'hi' || data.message === 'hello' || data.message === 'hola') {
                let data = await chatModel.create({
                    name: 'bot',
                    msg: 'welcome to my chatapp'
                })
                io.emit('recieve-msg', data)
            }
        } catch (error) {
            console.log(error);
        }
        // socket.broadcast.emit('recieve-msg', data)
    })
    socket.on('delete-msgs', () => {
        chatModel.deleteMany({}, (err, deletedData) => {
            if (!err) {
                io.emit('deleted-msg', 'Data Cleared')
            }
            else {
                console.log(err);
            }
        })
    })
})


server.listen(port, () => {
    console.log('server listening on port' + port);
})