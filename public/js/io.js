//websocket events
const socket = io('/user')
const roomId = $("meta[name='roomId']").attr("content") // unique room id 
const vidgrid = $("#participants")
const myVid = document.createElement('video') // create video element
myVid.muted = true // mute my video element
const myPeer = new Peer(undefined, {
	host: location.hostname,
	port: location.port || (location.protocol === 'https:' ? 443 : 80) || 3000,
	path: '/peer'
})

//get camera  and audio permision
//let UserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia //get user media
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true,
}).then((stream) => {
	handler.currentvidSteam(myVid, stream) 

	myPeer.on('call', call => {
		call.answer(stream)
		const video = document.createElement('video')
		call.on('stream', userVidStream => {
			handler.addvidSteam(video, userVidStream)
		})
	})

	socket.on('new-user-connected', (userid) => {
		handler.connect2NewUser(userid, stream)
	})
}) 

//connect to peer server
myPeer.on('open', id => {
	socket.emit('join', roomId, id)
})

//handlers
const handler = {
	// current video stream
	currentvidSteam: (vid, stream) => {
		vid.srcObject = stream 
		vid.addEventListener('loadedmetadata', () => {
			vid.play()
		}) 
		$("#myvideo").html(vid)
	}, 
	//user vidoe stream
	addvidSteam: (vid, stream) => {
		vid.srcObject = stream 
		vid.addEventListener('loadedmetadata', () => {
			vid.play()
		}) 
		vidgrid.append(vid)
	}, 
	connect2NewUser: (userid, stream) => {
		const call = myPeer.call(userid, stream) 
		const vid = document.createElement('video')
		call.on('stream', (userVidStream) => {
			//handler.addvidSteam(video, userVidStream) 
			vid.srcObject = stream 
		vid.addEventListener('loadedmetadata', () => {
			vid.play()
		}) 
		vidgrid.append(vid)
		})

		call.on('close', () => {
			video.remove()
		})
	}
}
