import { routes } from "./routes"

export const router: router = {
	currentRouteName: "",
	previousRouteName: "",
	get currentRoute() {
		return routes[router.currentRouteName]
	},
	get previousRoute() {
		return routes[router.previousRouteName]
	},

	getCurrentRouteName(): string {
		let currentRouteName = ""
		if (location.hash) {
			const hashRoute = location.hash?.replace("#", "")
			if (routes[hashRoute]) currentRouteName = hashRoute
		}
		if (!currentRouteName) currentRouteName = "main-menu"
		return currentRouteName
	},

	switchSections() {
		let sectionClass =
			router.currentRouteName === "practice"
				? "game"
				: router.currentRouteName
		document.querySelector(".section.active")?.classList.remove("active")
		document
			.querySelector(".section_" + sectionClass)
			?.classList.add("active")
	},

	callRouteHooks() {
		if (router.previousRoute && router.previousRoute.onLeave)
			router.previousRoute.onLeave()
		if (router.currentRoute.onEnter) router.currentRoute.onEnter()
	},

	manageRoute() {
		router.currentRouteName = router.getCurrentRouteName()

		router.callRouteHooks()
		router.switchSections()

		router.previousRouteName = router.currentRouteName
	},
}
// @ts-ignore
window.addEventListener("hashchange", router.manageRoute)
// @ts-ignore
window.router = router
