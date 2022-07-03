export const RoutePractice: Route = {
	url: "practice",
	onEnter(previousRoute) {
		document.querySelector(".section_game")?.classList.add("active")
	},
}
