import { SIGNALS } from "../../../common/constants/SIGNALS"

import { sendSignal } from "../engine/Signaller"
import { log } from "../engine/Utils"
import { EventBus, EVENTS } from "../engine/Events"
import { changeRouteTo } from "../engine/Router"
import { RouteLobby } from "./RouteLobby"
import { Player } from "../engine/Player"

export const RouteCreateGame: Route = {
	url: "create-game",
	onInit() {},
	onEnter() {
		document.querySelector(".section_create-game")?.classList.add("active")

		EventBus.emit(EVENTS.ROUTE_CREATE_GAME_ENTERED)

		Player.instances.me!.type = "host"
	},
	onLeave(nextRoute) {
		if (nextRoute.url !== RouteLobby.url)
			EventBus.emit(EVENTS.PEERCONNECTION_CLOSED)
		sendSignal(SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS)
		log(SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS)
	},
	subscriptions: [],
}
