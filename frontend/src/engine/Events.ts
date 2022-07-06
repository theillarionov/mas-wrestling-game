let eventTarget = document.body

export const EVENTS = {
	P2P_CHANNEL_OPENED: "p2p-channel-opened",
}

export const EventBus = {
	on(type: string, listener: (detail?: any) => void) {
		eventTarget.addEventListener(type, listener)
	},
	emit(type: string, detail?: any) {
		return eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
	},
}
