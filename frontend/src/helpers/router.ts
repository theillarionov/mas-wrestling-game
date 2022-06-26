import { peerConnection, initDataChannel } from "./webrtc"
import { SIGNALS } from "../../../common/constants/SIGNALS"
import { send } from "./signalling"
import { log } from "./utils"

export const router: router = {
	currentRouteName: "",
	previousRouteName: "",
	get currentRoute() {
		return router.routes[router.currentRouteName]
	},
	get previousRoute() {
		return router.routes[router.previousRouteName]
	},

	routes: {
		"main-menu": {},
		"join-game": {
			onEnter() {
				;(<HTMLElement>document.querySelector("#join-room")!).onclick =
					() => {
						send(SIGNALS.CLIENT.ASKS_TO_JOIN, {
							roomId: (<HTMLInputElement>(
								document.querySelector("#room-id-join")
							)).value,
						})

						peerConnection.ondatachannel = (e) => {
							initDataChannel(e.channel)
						}
					}
			},
		},
		"create-game": {
			async onEnter() {
				initDataChannel(peerConnection.createDataChannel("game"))

				const offer = await peerConnection.createOffer()

				peerConnection.setLocalDescription(offer)

				send(SIGNALS.HOST.GENERATED_OFFER, { offer })
				log(SIGNALS.HOST.GENERATED_OFFER)
			},
		},
		practice: {},
		game: {
			onEnter() {
				;(<HTMLElement>(
					document.querySelector("#send-message")!
				)).onclick = () => {
					const message = (<HTMLInputElement>(
						document.querySelector("#message")
					)).value
					peerConnection.channel.send(message)
				}
			},
		},
	},

	manageRoute() {
		router.currentRouteName = ""
		if (location.hash) {
			const hashRoute = location.hash?.replace("#", "")
			if (router.routes[hashRoute]) router.currentRouteName = hashRoute
		}
		if (!router.currentRouteName) router.currentRouteName = "main-menu"

		if (router.previousRoute && router.previousRoute.onLeave)
			router.previousRoute.onLeave()
		if (router.currentRoute.onEnter) router.currentRoute.onEnter()

		router.previousRouteName = router.currentRouteName

		let sectionClass =
			router.currentRouteName === "practice"
				? "game"
				: router.currentRouteName
		document.querySelector(".section.active")?.classList.remove("active")
		document
			.querySelector(".section_" + sectionClass)
			?.classList.add("active")
	},
}
// @ts-ignore
window.addEventListener("hashchange", router.manageRoute)
// @ts-ignore
window.router = router
