import { SIGNALS } from "../../../common/constants/SIGNALS"

import { peerConnection, initDataChannel } from "../engine/WebRTC"
import { sendSignal } from "../engine/Signaller"
import { log } from "../engine/Utils"
import { EVENTS } from "../engine/Events"
import { changeRouteTo } from "../engine/Router"

export const RouteCreateGame: Route = {
	url: "create-game",
	onInit() {},
	async onEnter() {
		document.querySelector(".section_create-game")?.classList.add("active")

		initDataChannel(peerConnection.createDataChannel("game"))

		const offer = await peerConnection.createOffer()

		peerConnection.setLocalDescription(offer)

		sendSignal(SIGNALS.PEER.STARTED_ACCEPTING_CONNECTIONS, { offer })
		log(SIGNALS.PEER.STARTED_ACCEPTING_CONNECTIONS)
	},
	onLeave() {
		sendSignal(SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS)
		log(SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS)
	},
	subscriptions: [
		{
			type: SIGNALS.REMOTE.SENDS_ANSWER,
			listener: ({ detail }: any) => {
				const { answer } = detail
				peerConnection.setRemoteDescription(answer)
				log(SIGNALS.REMOTE.SENDS_ANSWER)
			},
		},
		{
			type: EVENTS.P2P_CHANNEL_OPENED,
			listener: () => {
				changeRouteTo("game1")
				log(EVENTS.P2P_CHANNEL_OPENED)
			},
		},
	],
}
