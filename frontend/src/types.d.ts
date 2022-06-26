interface RTCPeerConnection {
	channel: RTCDataChannel
}

type route = {
	onEnter?(): void
	onLeave?(): void
}

type router = {
	currentRoute: route
	previousRoute: route
	manageRoute(): void
	init(): void
	routes: {
		[routeName: string]: route
	}
}
