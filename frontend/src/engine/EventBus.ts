let eventTarget = document.body

export const EventBus = {
	on(type: string, listener: (detail?: any) => void) {
		eventTarget.addEventListener(type, listener)
	},
	emit(type: string, detail?: any) {
		return eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
	},
}
