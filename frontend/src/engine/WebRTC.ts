import { SIGNALS } from "../../../common/constants/SIGNALS"
import { send } from "./Signaller"
import { log } from "./Utils"

export const peerConnection = new RTCPeerConnection({
	iceServers: [{ urls: ["stun:stun1.l.google.com:19302"] }],
})

peerConnection.onicecandidate = ({ candidate: iceCandidate }) => {
	send(SIGNALS.PEER.GENERATED_ICE_CANDIDATE, { iceCandidate })
	log(SIGNALS.PEER.GENERATED_ICE_CANDIDATE, iceCandidate)
}

export function initDataChannel(channel: RTCDataChannel) {
	channel.onmessage = (e) => {
		log("message", e)
		const div = document.createElement("div")
		div.textContent = e.data
		document.querySelector("#messages")!.prepend(div)
	}

	channel.onopen = (e) => {
		location.hash = "game"
		log("open!!!!", e)
	}
	channel.onclose = (e) => log("closed!!!!!!", e)
	peerConnection.channel = channel
}

/* peerConnection.onicegatheringstatechange = (e) => {
	log("iceGatheringState", target.iceGatheringState)
}

peerConnection.oniceconnectionstatechange = (event) => {
	log("iceConnectionState", peerConnection.iceConnectionState)
} */

// @ts-ignore
window.peerConnection = peerConnection