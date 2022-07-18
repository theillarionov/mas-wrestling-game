import { SIGNALS } from "../../../common/constants/SIGNALS"
import { EventBus, EVENTS } from "../engine/Events"
import { Player } from "../engine/Player"
import { RouteLobby } from "./RouteLobby"

export const RouteJoinGame: Route = {
	url: "join-game",
	onInit() {
		;(<HTMLElement>document.querySelector("#join-room")!).onclick = () => {
			EventBus.emit(SIGNALS.PEER.WANTS_TO_JOIN, {
				hostId: (<HTMLInputElement>(
					document.querySelector("#room-id-join")
				)).value,
			})
		}
	},
	onEnter() {
		document.querySelector(".section_join-game")?.classList.add("active")

		Player.instances.me!.type = "client"

		EventBus.emit(EVENTS.ROUTE_JOIN_GAME_ENTERED)
	},
	onLeave(nextRoute) {
		if (nextRoute.url !== RouteLobby.url)
			EventBus.emit(EVENTS.PEERCONNECTION_CLOSED)
	},
	subscriptions: [],
}
