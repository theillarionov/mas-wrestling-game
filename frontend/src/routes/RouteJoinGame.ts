import { SIGNALS } from "../../../common/constants/SIGNALS"
import { peerConnection, initDataChannel } from "../engine/WebRTC"
import { sendSignal } from "../engine/Signaller"
import { log } from "../engine/Utils"

export const RouteJoinGame: Route = {
	url: "join-game",
	onInit() {
		;(<HTMLElement>document.querySelector("#join-room")!).onclick = () => {
			sendSignal(SIGNALS.PEER.WANTS_TO_JOIN, {
				hostId: (<HTMLInputElement>(
					document.querySelector("#room-id-join")
				)).value,
			})

			peerConnection.ondatachannel = (e) => {
				initDataChannel(e.channel)
			}
		}
	},
	onEnter() {
		document.querySelector(".section_join-game")?.classList.add("active")
	},
	subscriptions: [
		{
			type: SIGNALS.REMOTE.SENDS_OFFER_AND_CANDIDATES,
			listener: async ({ detail }: any) => {
				const { offer, iceCandidates } = detail
				await peerConnection.setRemoteDescription(offer)

				iceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
					peerConnection.addIceCandidate(iceCandidate)
				})

				const answer = await peerConnection.createAnswer()
				peerConnection.setLocalDescription(answer)

				sendSignal(SIGNALS.PEER.GENERATED_ANSWER, { answer })
				log(SIGNALS.REMOTE.SENDS_OFFER_AND_CANDIDATES)
			},
		},
	],
}
