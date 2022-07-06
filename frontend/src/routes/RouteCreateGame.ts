import { SIGNALS } from "../../../common/constants/SIGNALS"

import { peerConnection, initDataChannel } from "../engine/WebRTC"
import { sendSignal } from "../engine/Signaller"
import { log } from "../engine/Utils"
import { Game } from "../engine/Game"

export const RouteCreateGame: Route = {
	url: "create-game",
	onInit() {},
	async onEnter() {
		document.querySelector(".section_create-game")?.classList.add("active")

		initDataChannel(peerConnection.createDataChannel("game"))

		const offer = await peerConnection.createOffer()

		peerConnection.setLocalDescription(offer)

		sendSignal(SIGNALS.PEER.GENERATED_OFFER, { offer })
		log(SIGNALS.PEER.GENERATED_OFFER)
	},
	onLeave(nextRoute) {
		if (nextRoute.url !== "game") {
			sendSignal(SIGNALS.PEER.CANCELLED_ROOM)
			Game.delete()
			log(SIGNALS.PEER.CANCELLED_ROOM)
		}
	},
	subscriptions: [
		/* {
			type: SIGNALS.HOST.CREATED_ROOM,
			listener: ({ detail }: any) => {
				const roomId = detail.roomId

				new Game({ roomId })

				document.querySelector("#room-id")!.innerHTML = roomId
				log(SIGNALS.HOST.CREATED_ROOM)
			},
		}, */
		{
			type: SIGNALS.REMOTE.SENDS_ANSWER,
			listener: ({ detail }: any) => {
				const { answer } = detail
				peerConnection.setRemoteDescription(answer)
				log(SIGNALS.REMOTE.SENDS_ANSWER)
			},
		},
	],
}
