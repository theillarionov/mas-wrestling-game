import { SIGNALS } from "../../../common/constants/SIGNALS"

import { sendSignal } from "../engine/Signaller"
import { log } from "../engine/Utils"
import { EventBus, EVENTS } from "../engine/Events"
import { changeRouteTo } from "../engine/Router"
import { RouteGame } from "./RouteGame"

export const RouteCreateGame: Route = {
	url: "create-game",
	onInit() {},
	onEnter() {
		document.querySelector(".section_create-game")?.classList.add("active")

		EventBus.emit(EVENTS.ROUTE_CREATE_GAME_ENTERED)
	},
	onLeave() {
		sendSignal(SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS)
		log(SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS)
	},
	subscriptions: [
		{
			type: EVENTS.P2P_CHANNEL_OPENED,
			listener: () => {
				changeRouteTo(RouteGame.url)
				log(EVENTS.P2P_CHANNEL_OPENED)
			},
		},
	],
}
