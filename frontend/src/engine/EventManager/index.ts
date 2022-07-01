import { events as SignallerEvents } from "./SignallerEvents"
import { events as RouterEvents } from "./RouterEvents"

const events = {
	...SignallerEvents,
	...RouterEvents,
}

export function publish(event: string, payload: object) {
	events[event](payload)
}
