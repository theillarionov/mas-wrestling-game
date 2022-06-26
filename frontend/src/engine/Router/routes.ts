import { peerConnection, initDataChannel } from "../WebRTC"
import { SIGNALS } from "../../../../common/constants/SIGNALS"
import { send } from "../Signaller"
import { log } from "../Utils"

export const routes: routes = {
	"main-menu": {
		url: "main-menu",
	},
	"join-game": {
		url: "join-game",
		onEnter() {
			;(<HTMLElement>document.querySelector("#join-room")!).onclick =
				() => {
					send(SIGNALS.CLIENT.ASKS_TO_JOIN, {
						roomId: (<HTMLInputElement>(
							document.querySelector("#room-id-join")
						)).value,
					})

					peerConnection.ondatachannel = (e) => {
						initDataChannel(e.channel)
					}
				}
		},
	},
	"create-game": {
		url: "create-game",
		async onEnter() {
			initDataChannel(peerConnection.createDataChannel("game"))

			const offer = await peerConnection.createOffer()

			peerConnection.setLocalDescription(offer)

			send(SIGNALS.HOST.GENERATED_OFFER, { offer })
			log(SIGNALS.HOST.GENERATED_OFFER)
		},
		onLeave() {
			send(SIGNALS.HOST.CANCELLED_GAME)
			log(SIGNALS.HOST.CANCELLED_GAME)
		},
	},
	practice: {
		url: "practice",
	},
	game: {
		url: "game",
		onEnter() {
			;(<HTMLElement>document.querySelector("#send-message")!).onclick =
				() => {
					const message = (<HTMLInputElement>(
						document.querySelector("#message")
					)).value
					peerConnection.channel.send(message)
				}
		},
	},
}
