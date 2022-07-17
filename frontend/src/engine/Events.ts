let eventTarget = document.body

export const EVENTS = {
	P2P_CHANNEL_OPENED: "p2p-channel-opened",
	ROUTE_CREATE_GAME_ENTERED: "route-create-game-entered",
	ROUTE_JOIN_GAME_ENTERED: "route-join-game-entered",
	MESSAGE_SENT: "message-sent",
	PEERCONNECTION_CLOSED: "peerconnection-closed",
}

export const EventBus = {
	on(type: string, listener: (detail?: any) => void) {
		eventTarget.addEventListener(type, listener)
	},
	emit(type: string, detail?: any) {
		return eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
	},
}
