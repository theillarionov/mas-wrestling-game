interface RTCPeerConnection {
	channel: RTCDataChannel
}

type routes = {
	[routeName: string]: route
}

interface PlayerConstructor {
	id: string
}

interface GameConstructor {
	roomId: string
}
