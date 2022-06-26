import { SIGNALS } from "../../../common/constants/SIGNALS"
import { Player } from "../classes/Player"
import { log } from "./Utils"
import { peerConnection } from "./WebRTC"

const socket = new WebSocket(
	import.meta.env.WS_SCHEMA +
		import.meta.env.WS_ADDRESS +
		":" +
		import.meta.env.WS_PORT
)

socket.onopen = () => {
	send("handshake", { id: localStorage.getItem("id") })
}

socket.onmessage = async ({ data }) => {
	data = JSON.parse(data)
	const type = data.type
	const message = data.payload

	switch (type) {
		case SIGNALS.SERVER.CREATED_PLAYER:
			Player.instances.me = new Player({ id: message.id })
			log(SIGNALS.SERVER.CREATED_PLAYER, message.id)
			break

		case SIGNALS.HOST.CREATED_ROOM:
			document.querySelector("#room-id")!.innerHTML = message.roomId
			break
		case SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES:
			await peerConnection.setRemoteDescription(message.offer)

			message.iceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
				peerConnection.addIceCandidate(iceCandidate)
			})

			const answer = await peerConnection.createAnswer()
			peerConnection.setLocalDescription(answer)

			send(SIGNALS.CLIENT.GENERATED_ANSWER, { answer })
			log(SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES)
			break

		case SIGNALS.CLIENT.SENDS_ANSWER:
			peerConnection.setRemoteDescription(message.answer)
			log(SIGNALS.CLIENT.SENDS_ANSWER)
			break

		case SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE:
			peerConnection.addIceCandidate(message.iceCandidate)
			log(SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, message.iceCandidate)
			break

		case SIGNALS.ERROR:
			log(SIGNALS.ERROR, message.text)
			break
	}
}

socket.onclose = (e) => {
	log("close from client", e)
}

socket.onerror = (e) => {
	log("error from client", e)
}

export function send(type: string, payload: object = {}) {
	socket.send(JSON.stringify({ type, payload }))
}
