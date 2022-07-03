import { EVENTS } from "../../../common/constants/EVENTS"

import { peerConnection, initDataChannel } from "../engine/WebRTC"
import { sendSignal } from "../engine/Signaller"
import { log } from "../engine/Utils"

export const RouteCreateGame: Route = {
	url: "create-game",
	onInit() {},
	async onEnter() {
		document.querySelector(".section_create-game")?.classList.add("active")

		initDataChannel(peerConnection.createDataChannel("game"))

		const offer = await peerConnection.createOffer()

		peerConnection.setLocalDescription(offer)

		sendSignal(EVENTS.SIGNALS.HOST.GENERATED_OFFER, { offer })
		log(EVENTS.SIGNALS.HOST.GENERATED_OFFER)
	},
	subscriptions: [],
}
