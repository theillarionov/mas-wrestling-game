import { EventBus, EVENTS } from "../engine/Events"

export const RouteGame: Route = {
	url: "game",
	onInit() {
		;(<HTMLElement>document.querySelector("#send-message")!).onclick =
			() => {
				EventBus.emit(EVENTS.MESSAGE_SENT, {
					message: (<HTMLInputElement>(
						document.querySelector("#message")
					)).value,
				})
			}
	},
	onEnter() {
		document.querySelector(".section_game")?.classList.add("active")
	},
	subscriptions: [],
}
