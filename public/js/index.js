const socket = io('/user')
socket.on('disconnect', () => {
    console.log("Disconnected to server")
})