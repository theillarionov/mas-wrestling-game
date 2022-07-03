export const RouteMainMenu: Route = {
	url: "main-menu",
	onInit() {},
	onEnter() {
		document.querySelector(".section_main-menu")?.classList.add("active")
	},
}
