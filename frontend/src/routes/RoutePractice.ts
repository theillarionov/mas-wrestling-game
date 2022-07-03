export const RoutePractice: Route = {
	url: "practice",
	onEnter() {
		document.querySelector(".section_game")?.classList.add("active")
	},
}
