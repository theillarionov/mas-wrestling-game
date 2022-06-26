interface RTCPeerConnection {
	channel: RTCDataChannel
}

type route = {
	onEnter?(): void
	onLeave?(): void
}

type router = {
	currentRouteName: string
	previousRouteName: string
	currentRoute: route
	previousRoute: route
	manageRoute(): void
	routes: {
		[routeName: string]: route
	}
}

interface PlayerConstructor {
	id: string
}
