interface RTCPeerConnection {
	channel: RTCDataChannel
}

type route = {
	onEnter?(): void
	onLeave?(): void
}

type routes = {
	[routeName: string]: route
}

type router = {
	currentRouteName: string
	previousRouteName: string
	currentRoute: route
	previousRoute: route
	manageRoute(): void
	switchSections(): void
	callRouteHooks(): void
	getCurrentRouteName(): string
}

interface PlayerConstructor {
	id: string
}
