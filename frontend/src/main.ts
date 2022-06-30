import "./css/main.css"
/* import adapter from "webrtc-adapter"
import * as PIXI from "pixi.js" */
import { manageRoute } from "./engine/Router"

import { events as SignallerEvents } from "./engine/Signaller/events"
import { events as RouterEvents } from "./engine/Router/events"

const events = {
	...SignallerEvents,
	...RouterEvents,
}

export function publish(event: string, payload: object) {
	events[event](payload)
}

manageRoute()
