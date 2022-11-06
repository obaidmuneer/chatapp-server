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

    socket.on('send-msg', (data) => {
        chatModel.create({
            name: data.name,
            msg: data.message
        }, (err, savedData) => {
            if (!err) {
                io.emit('recieve-msg', savedData)
            }
            else {
                console.log(err);
            }
        })

        // socket.broadcast.emit('recieve-msg', data)

        if (data.message === 'hi' || data.message === 'hello' || data.message === 'hola') {
            chatModel.findOne({ name: 'bot' }, (err, data) => {
                if (data) {
                    io.emit('recieve-msg',data)
                } else {
                    chatModel.create({
                        name: 'bot',
                        msg: 'welcome to my chatapp'
                    }, (err, data) => {
                        if (!err) {
                            io.emit('recieve-msg',data)
                        }
                    })
                }
            })
        }
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