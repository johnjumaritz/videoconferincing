//for developlement only, require .env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express') 
const app = express() 
const port = process.env.PORT || 3000 // server port
const http = require('http').createServer(app, {
    cors: {
        origin: [], //you external websites here 
        methods: [] //methods POST, GET, DELETE, etc....
    }
}) 
const socket = require('socket.io')(http)
const session = require('express-session') // session 
const cookieParser = require('cookie-parser') // cookie 
const multer = require('multer') // for file uploads 
const bodyParser = require('body-parser') //use to parse form data
const helmet = require('helmet') // server extra security 
const cors = require('cors') // see cors in google :D 
const xs = require('xss') // excape html elements 
const csrf = require('csurf') // csrf token for submitting forms 
const path = require('path') 
const { ExpressPeerServer } = require('peer') 
const { v4: uuidV4 } = require('uuid')
const peerServer = ExpressPeerServer(http, {
  debug: true, 
  allow_discovery: true
})
const route = require('./routes/route')
//server settings 
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
)
app.use(express.static(path.join(__dirname, './public'))) //server files like js,css, & images
app.use(bodyParser.urlencoded({ extended: false })) // to parse form data 
app.use(express.json()) // json 
app.use(multer().array())
app.use(cors())
app.set('view engine', 'ejs')
if(app.get('env') === 'production'){
    app.set('trust proxy', 1)
} 
app.use(cookieParser())
app.use(csrf({cookie: true}))
app.use('/peer', peerServer)
app.use(route)

//http 404 request
app.use(function(req, res) { 
    req.method === "GET" ? res.status(404).send() : res.status(404).send()
})

//socket io events 
const admin = socket.of('/admin')
const user = socket.of('/user')

admin.on('connection', async (io) => {
    console.log(`Admin Connected ${io.id}`)
})
user.on('connection', async (io) => {
    //console.log(`New User Connected ${io.id}`) 
    io.on('join', async (roomid, userid) => {
        io.join(roomid) 
        io.to(roomid).emit('new-user-connected', userid)
    })
})
//listen to port
http.listen(port, () => {
    console.log(`Server Fired on port ${port}`)
})
