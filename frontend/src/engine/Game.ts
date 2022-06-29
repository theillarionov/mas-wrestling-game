import { SIGNALS } from "../../../common/constants/SIGNALS"
import { Player } from "../classes/Player"
import { log } from "./Utils"
import { send } from "./Signaller"
import { peerConnection } from "./WebRTC"

export let roomId = ""

const events = {
	// SIGNALLING
	[SIGNALS.SERVER.CREATED_PLAYER](message: any) {
		Player.instances.me = new Player({ id: message.id })
		log(SIGNALS.SERVER.CREATED_PLAYER, message.id)
	},

	[SIGNALS.HOST.CREATED_ROOM](message: any) {
		document.querySelector("#room-id")!.innerHTML = message.roomId
	},
	async [SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES](message: any) {
		await peerConnection.setRemoteDescription(message.offer)

		message.iceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
			peerConnection.addIceCandidate(iceCandidate)
		})

		const answer = await peerConnection.createAnswer()
		peerConnection.setLocalDescription(answer)

		send(SIGNALS.CLIENT.GENERATED_ANSWER, { answer })
		log(SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES)
	},

	[SIGNALS.CLIENT.SENDS_ANSWER](message: any) {
		peerConnection.setRemoteDescription(message.answer)
		log(SIGNALS.CLIENT.SENDS_ANSWER)
	},

	[SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE](message: any) {
		peerConnection.addIceCandidate(message.iceCandidate)
		log(SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, message.iceCandidate)
	},

	[SIGNALS.ERROR](message: any) {
		log(SIGNALS.ERROR, message.text)
	},
}

export function publish(event: string, payload: object) {
	events[event](payload)
}
