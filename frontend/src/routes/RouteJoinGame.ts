import { EVENTS } from "../../../common/constants/EVENTS"
import { peerConnection, initDataChannel } from "../engine/WebRTC"
import { sendSignal } from "../engine/Signaller"

export const RouteJoinGame: Route = {
	url: "join-game",
	onInit() {
		;(<HTMLElement>document.querySelector("#join-room")!).onclick = () => {
			sendSignal(EVENTS.SIGNALS.CLIENT.ASKS_TO_JOIN, {
				roomId: (<HTMLInputElement>(
					document.querySelector("#room-id-join")
				)).value,
			})

			peerConnection.ondatachannel = (e) => {
				initDataChannel(e.channel)
			}
		}
	},
	onEnter() {
		document.querySelector(".section_join-game")?.classList.add("active")
	},
	subscriptions: [],
}
