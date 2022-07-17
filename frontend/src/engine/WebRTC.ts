import { SIGNALS } from "../../../common/constants/SIGNALS"
import { sendSignal } from "./Signaller"
import { log } from "./Utils"
import { EventBus, EVENTS } from "./Events"

export const peerConnection = new RTCPeerConnection({
	iceServers: [
		{
			urls: [import.meta.env.GAME_STUN_SERVER],
		},
		{
			urls: [import.meta.env.GAME_TURN_SERVER],
			username: import.meta.env.GAME_TURN_USER,
			credential: import.meta.env.GAME_TURN_PASSWORD,
		},
	],
})

peerConnection.onicecandidate = ({ candidate: iceCandidate }) => {
	sendSignal(SIGNALS.PEER.GENERATED_ICE_CANDIDATE, { iceCandidate })
	log(SIGNALS.PEER.GENERATED_ICE_CANDIDATE, iceCandidate)
}

EventBus.on(SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, ({ detail }) => {
	const { iceCandidate } = detail
	peerConnection.addIceCandidate(iceCandidate)
	log(SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, iceCandidate)
})

export function initDataChannel(channel: RTCDataChannel) {
	channel.onmessage = (e) => {
		log("message", e)
		const div = document.createElement("div")
		div.textContent = e.data
		document.querySelector("#messages")!.prepend(div)
	}

	channel.onopen = (e) => {
		EventBus.emit(EVENTS.P2P_CHANNEL_OPENED)
		log("channel.open", e)
	}
	channel.onclose = (e) => log("channel.close", e)
	peerConnection.channel = channel
}

/* peerConnection.onicegatheringstatechange = (e) => {
	log("iceGatheringState", target.iceGatheringState)
}
*/
peerConnection.oniceconnectionstatechange = () => {
	if (peerConnection.iceConnectionState === "disconnected") {
	}
	log("iceConnectionState", peerConnection.iceConnectionState)
}

// @ts-ignore
window.peerConnection = peerConnection
