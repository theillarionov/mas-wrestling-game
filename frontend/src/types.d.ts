interface RTCPeerConnection {
	channel: RTCDataChannel
}

type Routes = {
	[routeName: string]: Route
}

type Route = {
	url: string
	onInit?(): void
	onEnter?(previousRoute: Route): void
	onLeave?(nextRoute: Route): void
	subscriptions?: array
}

interface PlayerConstructor {
	id: string
}

interface GameConstructor {
	roomId: string
}
