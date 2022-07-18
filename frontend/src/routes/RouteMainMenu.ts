import { EVENTS } from "../engine/Events"
import { changeRouteTo } from "../engine/Router"
import { RouteLobby } from "./RouteLobby"
import { log } from "../engine/Utils"

export const RouteMainMenu: Route = {
	url: "main-menu",
	onInit() {},
	onEnter() {
		document.querySelector(".section_main-menu")?.classList.add("active")
	},
	subscriptions: [
		{
			type: EVENTS.P2P_CHANNEL_OPENED,
			listener: () => {
				changeRouteTo(RouteLobby.url)
				log(EVENTS.P2P_CHANNEL_OPENED)
			},
		},
	],
}
