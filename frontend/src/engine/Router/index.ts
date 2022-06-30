//import { routes } from "./routes"
import { publish } from "../../main"
import { EVENTS } from "../../../../common/constants/EVENTS"

let currentRoute: string
let previousRoute: string

const routes = ["main-menu", "join-game", "create-game", "game", "practice"]

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

window.addEventListener("hashchange", manageRoute)
