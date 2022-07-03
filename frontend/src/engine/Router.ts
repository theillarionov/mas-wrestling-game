import { RouteCreateGame } from "../routes/RouteCreateGame"
import { RouteMainMenu } from "../routes/RouteMainMenu"
import { RoutePractice } from "../routes/RoutePractice"
import { RouteJoinGame } from "../routes/RouteJoinGame"

const routes: Routes = {
	[RouteMainMenu.url]: RouteMainMenu,
	[RoutePractice.url]: RoutePractice,
	[RouteJoinGame.url]: RouteJoinGame,
	[RouteCreateGame.url]: RouteCreateGame,
}

for (const url in routes) {
	if (routes[url].onInit) routes[url].onInit?.()
	if (routes[url].subscriptions) {
		// привязать события
	}
}

let currentRoute: Route
let previousRoute: Route

function manageRoute() {
	let currentRouteName = ""
	if (location.hash) {
		const hashRoute = location.hash?.replace("#", "")
		if (routes[hashRoute]) currentRouteName = hashRoute
	}
	if (!currentRouteName) currentRouteName = "main-menu"
	currentRoute = routes[currentRouteName]

	document.querySelector(".section.active")?.classList.remove("active")

	if (previousRoute && previousRoute.onLeave)
		previousRoute.onLeave(currentRoute)
	if (currentRoute.onEnter) currentRoute.onEnter(previousRoute)
	previousRoute = currentRoute
}

export function init() {
	manageRoute()
	window.addEventListener("hashchange", manageRoute)
}
