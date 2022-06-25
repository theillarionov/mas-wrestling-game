import "./style.css"
import adapter from "webrtc-adapter"
import * as PIXI from "pixi.js"

import { SIGNALS } from "../../common/constants/SIGNALS"

import { Player } from "./classes/Player"
import { socket, send } from "./socket"

declare const window: any
// const isProduction = import.meta.env.MODE === "production"

const player = new Player()

socket.onopen = () => {
	send("handshake", { id: player.id })
}

console.log(adapter, PIXI)

socket.onmessage = async ({ data }) => {
	data = JSON.parse(data)
	const type = data.type
	const message = data.payload

	switch (type) {
		case SIGNALS.SERVER.GENERATED_ID:
			player.id = message.id
			log(SIGNALS.SERVER.GENERATED_ID, message.id)
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
			throw new Error(message.text)
			break
	}
}

socket.onclose = (e) => {
	log("close from client", e)
}

socket.onerror = (e) => {
	log("error from client", e)
}

// WEBRTC
const peerConnection = new RTCPeerConnection({
	iceServers: [{ urls: ["stun:stun1.l.google.com:19302"] }],
})

peerConnection.onicecandidate = ({ candidate: iceCandidate }) => {
	send(SIGNALS.PEER.GENERATED_ICE_CANDIDATE, { iceCandidate })
	log(SIGNALS.PEER.GENERATED_ICE_CANDIDATE, iceCandidate)
}

/* peerConnection.onicegatheringstatechange = (e) => {
	log("iceGatheringState", target.iceGatheringState)
}

peerConnection.oniceconnectionstatechange = (event) => {
	log("iceConnectionState", peerConnection.iceConnectionState)
} */

async function hostGame() {
	initDataChannel(peerConnection.createDataChannel("game"))

	const offer = await peerConnection.createOffer()

	await peerConnection.setLocalDescription(offer)

	send(SIGNALS.HOST.GENERATED_OFFER, { offer })
	log(SIGNALS.HOST.GENERATED_OFFER)
}

function joinGame() {
	send(SIGNALS.CLIENT.ASKS_TO_JOIN, {
		roomId: (<HTMLInputElement>document.querySelector("#room-id-join"))
			.value,
	})

	peerConnection.ondatachannel = (e) => {
		initDataChannel(e.channel)
	}
}

function sendMessage() {
	const message = (<HTMLInputElement>document.querySelector("#message")).value
	peerConnection.channel.send(message)
}

function initDataChannel(channel: RTCDataChannel) {
	channel.onmessage = (e) => {
		log("message", e)
		const div = document.createElement("div")
		div.textContent = e.data
		document.querySelector("#messages")!.prepend(div)
	}

	channel.onopen = (e) => log("open!!!!", e)
	channel.onclose = (e) => log("closed!!!!!!", e)
	peerConnection.channel = channel
}

const logDiv = document.querySelector("#log")
logDiv!.innerHTML = ""
function log(message: string, body: any = {}) {
	console.log(message, body)

	logDiv!.innerHTML += `<p><b>${message}</b>: ${JSON.stringify(body)}</p>`
}

window.joinGame = joinGame
window.hostGame = hostGame
window.sendMessage = sendMessage
window.peerConnection = peerConnection
