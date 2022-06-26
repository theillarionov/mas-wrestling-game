import { peerConnection, initDataChannel } from "../webrtc"
import { SIGNALS } from "../../../../common/constants/SIGNALS"
import { send } from "../signalling"
import { log } from "../utils"

export const routes: routes = {
	"main-menu": {},
	"join-game": {
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
	practice: {},
	game: {
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
