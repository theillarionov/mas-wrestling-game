//import { routes } from "./routes"
import { publish } from "../engine/EventManager"
import { EVENTS } from "../../../common/constants/EVENTS"

const routes = ["main-menu", "join-game", "create-game", "game", "practice"]

export let currentRoute = ""
export let previousRoute = ""

export function manageRoute() {
	currentRoute = ""
	if (location.hash) {
		const hashRoute = location.hash?.replace("#", "")
		if (routes.indexOf(hashRoute) > -1) currentRoute = hashRoute
	}
	if (!currentRoute) currentRoute = "main-menu"

	if (previousRoute)
		publish(EVENTS.ROUTER.ROUTE_LEFT, { name: previousRoute })
	publish(EVENTS.ROUTER.ROUTE_OPENED, { name: currentRoute })
	previousRoute = currentRoute

	let sectionClass = currentRoute === "practice" ? "game" : currentRoute
	document.querySelector(".section.active")?.classList.remove("active")
	document.querySelector(".section_" + sectionClass)?.classList.add("active")
}
