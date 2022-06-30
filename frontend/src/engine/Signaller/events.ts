import { EVENTS } from "../../../../common/constants/EVENTS"
import { peerConnection } from "../WebRTC"
import { send } from "."
import { log } from "../Utils"

const SIGNALS = EVENTS.SIGNALS

export const events = {
	[SIGNALS.HOST.CREATED_ROOM]({ roomId }: any) {
		document.querySelector("#room-id")!.innerHTML = roomId
	},
	async [SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES]({
		offer,
		iceCandidates,
	}: any) {
		await peerConnection.setRemoteDescription(offer)

		iceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
			peerConnection.addIceCandidate(iceCandidate)
		})

		const answer = await peerConnection.createAnswer()
		peerConnection.setLocalDescription(answer)

		send(SIGNALS.CLIENT.GENERATED_ANSWER, { answer })
		log(SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES)
	},

	[SIGNALS.CLIENT.SENDS_ANSWER]({ answer }: any) {
		peerConnection.setRemoteDescription(answer)
		log(SIGNALS.CLIENT.SENDS_ANSWER)
	},

	[SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE]({ iceCandidate }: any) {
		peerConnection.addIceCandidate(iceCandidate)
		log(SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, iceCandidate)
	},

	[SIGNALS.ERROR]({ text }: any) {
		log(SIGNALS.ERROR, text)
	},
}
