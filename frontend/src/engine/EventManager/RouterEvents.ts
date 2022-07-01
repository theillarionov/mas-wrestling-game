import { peerConnection, initDataChannel } from "../WebRTC"
import { sendSignal } from "../Signaller"
import { log } from "../Utils"
import { EVENTS } from "../../../../common/constants/EVENTS"

export const events = {
	async [EVENTS.ROUTER.ROUTE_OPENED]({ name }: any) {
		switch (name) {
			case "create-game":
				initDataChannel(peerConnection.createDataChannel("game"))

				const offer = await peerConnection.createOffer()

				peerConnection.setLocalDescription(offer)

				sendSignal(EVENTS.SIGNALS.HOST.GENERATED_OFFER, { offer })
				log(EVENTS.SIGNALS.HOST.GENERATED_OFFER)
				break
			case "join-game":
				;(<HTMLElement>document.querySelector("#join-room")!).onclick =
					() => {
						sendSignal(EVENTS.SIGNALS.CLIENT.ASKS_TO_JOIN, {
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
	[EVENTS.ROUTER.ROUTE_LEFT]({ name }: any) {
		console.log("router left " + name)
	},
}
