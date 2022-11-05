import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import  chatModel  from './models/chatModel.mjs'

const app = express()
const port = process.env.PORT || 8080
const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

let msgs = []

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.emit('msgs',msgs)

    socket.on('send-msg' ,(data) => {
        console.log(data);
        msgs.push(data);
        io.emit('recieve-msg', data)
        // socket.broadcast.emit('recieve-msg', data)

    })
})


server.listen(port, () => {
    console.log('server listening on port' + port);
})