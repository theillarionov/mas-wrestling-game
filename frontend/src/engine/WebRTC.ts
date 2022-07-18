import { SIGNALS } from "../../../common/constants/SIGNALS"
import { sendSignal } from "./Signaller"
import { log } from "./Utils"
import { EventBus, EVENTS } from "./Events"
import { changeRouteTo } from "./Router"
import { RouteMainMenu } from "../routes/RouteMainMenu"

let peerConnection: RTCPeerConnection | null = null

EventBus.on(EVENTS.MESSAGE_SENT, ({ detail }) => {
	const message = detail.message

	peerConnection!.channel.send(message)
})

EventBus.on(EVENTS.ROUTE_CREATE_GAME_ENTERED, async () => {
	initPeerConnection()

	if (peerConnection) {
		initDataChannel(peerConnection.createDataChannel("game"))

		const offer = await peerConnection.createOffer()

		peerConnection.setLocalDescription(offer)

		sendSignal(SIGNALS.PEER.STARTED_ACCEPTING_CONNECTIONS, { offer })
		log(SIGNALS.PEER.STARTED_ACCEPTING_CONNECTIONS)
	}
})

EventBus.on(EVENTS.ROUTE_JOIN_GAME_ENTERED, async () => {
	initPeerConnection()
})

EventBus.on(EVENTS.PEERCONNECTION_CLOSED, () => {
	closePeerConnection()
})

EventBus.on(SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, ({ detail }) => {
	const { iceCandidate } = detail
	peerConnection!.addIceCandidate(iceCandidate)
	log(SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, iceCandidate)
})

EventBus.on(SIGNALS.REMOTE.SENDS_ANSWER, ({ detail }) => {
	const { answer } = detail
	peerConnection!.setRemoteDescription(answer)
	log(SIGNALS.REMOTE.SENDS_ANSWER)
})

EventBus.on(SIGNALS.PEER.WANTS_TO_JOIN, ({ detail }) => {
	sendSignal(SIGNALS.PEER.WANTS_TO_JOIN, detail)

	peerConnection!.ondatachannel = (e) => {
		initDataChannel(e.channel)
	}
})

EventBus.on(SIGNALS.REMOTE.SENDS_OFFER_AND_CANDIDATES, async ({ detail }) => {
	const { offer, iceCandidates } = detail
	if (peerConnection) {
		await peerConnection.setRemoteDescription(offer)

		iceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
			peerConnection!.addIceCandidate(iceCandidate)
		})

		const answer = await peerConnection.createAnswer()
		peerConnection.setLocalDescription(answer)

		sendSignal(SIGNALS.PEER.GENERATED_ANSWER, { answer })
		log(SIGNALS.REMOTE.SENDS_OFFER_AND_CANDIDATES)
	}
})

function initPeerConnection() {
	peerConnection = new RTCPeerConnection({
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

	peerConnection.oniceconnectionstatechange = () => {
		if (
			peerConnection &&
			peerConnection.iceConnectionState === "disconnected"
		) {
			log("iceConnectionState", peerConnection!.iceConnectionState)
			sendSignal(SIGNALS.REMOTE.DISCONNECTED)
			closePeerConnection()
			changeRouteTo(RouteMainMenu.url)
		}
	}
}

function closePeerConnection() {
	if (peerConnection) {
		peerConnection.close()
		peerConnection = null
	}
}

function initDataChannel(channel: RTCDataChannel) {
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
	peerConnection!.channel = channel
}

// @ts-ignore
window.peerConnection = peerConnection
