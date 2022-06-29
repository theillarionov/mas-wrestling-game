import "./css/main.css"
/* import adapter from "webrtc-adapter"
import * as PIXI from "pixi.js" */
import { send } from "./engine/Signaller"
import { EVENTS } from "../../common/constants/EVENTS"
import { Player } from "./classes/Player"
import { log } from "./engine/Utils"
import { peerConnection, initDataChannel } from "./engine/WebRTC"
import { manageRoute } from "./engine/Router"

const events = {
	// SIGNALLING
	[EVENTS.SIGNALS.SERVER.CREATED_PLAYER]({ id }: any) {
		Player.instances.me = new Player({ id })
		log(EVENTS.SIGNALS.SERVER.CREATED_PLAYER, id)
	},

	[EVENTS.SIGNALS.HOST.CREATED_ROOM]({ roomId }: any) {
		document.querySelector("#room-id")!.innerHTML = roomId
	},
	async [EVENTS.SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES]({
		offer,
		iceCandidates,
	}: any) {
		await peerConnection.setRemoteDescription(offer)

		iceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
			peerConnection.addIceCandidate(iceCandidate)
		})

		const answer = await peerConnection.createAnswer()
		peerConnection.setLocalDescription(answer)

		send(EVENTS.SIGNALS.CLIENT.GENERATED_ANSWER, { answer })
		log(EVENTS.SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES)
	},

	[EVENTS.SIGNALS.CLIENT.SENDS_ANSWER]({ answer }: any) {
		peerConnection.setRemoteDescription(answer)
		log(EVENTS.SIGNALS.CLIENT.SENDS_ANSWER)
	},

	[EVENTS.SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE]({ iceCandidate }: any) {
		peerConnection.addIceCandidate(iceCandidate)
		log(EVENTS.SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE, iceCandidate)
	},

	[EVENTS.SIGNALS.ERROR]({ text }: any) {
		log(EVENTS.SIGNALS.ERROR, text)
	},

	// ROUTER
	async [EVENTS.ROUTE.OPENED]({ name }: any) {
		switch (name) {
			case "create-game":
				initDataChannel(peerConnection.createDataChannel("game"))

				const offer = await peerConnection.createOffer()

				peerConnection.setLocalDescription(offer)

				send(EVENTS.SIGNALS.HOST.GENERATED_OFFER, { offer })
				log(EVENTS.SIGNALS.HOST.GENERATED_OFFER)
				break
			case "join-game":
				;(<HTMLElement>document.querySelector("#join-room")!).onclick =
					() => {
						send(EVENTS.SIGNALS.CLIENT.ASKS_TO_JOIN, {
							roomId: (<HTMLInputElement>(
								document.querySelector("#room-id-join")
							)).value,
						})

						peerConnection.ondatachannel = (e) => {
							initDataChannel(e.channel)
						}
					}
				break
			case "game":
				;(<HTMLElement>(
					document.querySelector("#send-message")!
				)).onclick = () => {
					const message = (<HTMLInputElement>(
						document.querySelector("#message")
					)).value
					peerConnection.channel.send(message)
				}
				break
		}
		console.log("router opened " + name)
	},
	[EVENTS.ROUTE.LEFT]({ name }: any) {
		console.log("router left " + name)
	},
}

export function publish(event: string, payload: object) {
	events[event](payload)
}

manageRoute()
send(EVENTS.SIGNALS.HANDSHAKE, { id: localStorage.getItem("id") })
