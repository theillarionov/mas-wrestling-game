interface RTCPeerConnection {
	channel: RTCDataChannel
}

type route = {
	url: string
	onEnter?(): void
	onLeave?(): void
}

type routes = {
	[routeName: string]: route
}

interface PlayerConstructor {
	id: string
}
