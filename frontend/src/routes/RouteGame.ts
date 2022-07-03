import { peerConnection } from "../engine/WebRTC"

export const RouteGame: Route = {
	url: "game",
	onInit() {
		;(<HTMLElement>document.querySelector("#send-message")!).onclick =
			() => {
				const message = (<HTMLInputElement>(
					document.querySelector("#message")
				)).value
				peerConnection.channel.send(message)
			}
	},
	onEnter() {
		document.querySelector(".section_game")?.classList.add("active")
	},
	subscriptions: [],
}
