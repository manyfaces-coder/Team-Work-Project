const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 3006


server.listen(PORT, () => {
    console.log('server started')
})

io.on('connection', socket => {
    console.log('socket connect')})


