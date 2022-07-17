export const RouteLobby: Route = {
	url: "lobby",
	onInit() {},
	onEnter() {
		document.querySelector(".section_lobby")?.classList.add("active")
	},
	subscriptions: [],
}
