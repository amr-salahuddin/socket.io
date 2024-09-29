const io = require('socket.io')(3001, {
    cors: {
        origin: '*',
    }
})

io.on('connection', socket => {
    console.log('Socket connected', socket.id)
    socket.on('join-room', (room, name) => {
        socket.join(room)
        socket.to(room).emit('user-connected', name,room)
        socket.on('disconnect', () => {
            socket.to(room).emit('user-disconnected', name)
        })
    })
    socket.on('send-message', (message, room) => {
        if (room == '') {
            socket.broadcast.emit('receive-message', message)
        }
        else{
            socket.to(room).emit('receive-message', message)
        }
    })
})

