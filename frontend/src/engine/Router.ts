import { EventBus } from "./EventBus"

import { RouteCreateGame } from "../routes/RouteCreateGame"
import { RouteMainMenu } from "../routes/RouteMainMenu"
import { RoutePractice } from "../routes/RoutePractice"
import { RouteJoinGame } from "../routes/RouteJoinGame"

let currentRoute: Route
let previousRoute: Route

const routes: Routes = {
	[RouteMainMenu.url]: RouteMainMenu,
	[RoutePractice.url]: RoutePractice,
	[RouteJoinGame.url]: RouteJoinGame,
	[RouteCreateGame.url]: RouteCreateGame,
}

for (const url in routes) {
	if (routes[url].onInit) routes[url].onInit?.()
	if (routes[url].subscriptions) {
		routes[url].subscriptions.forEach((subscription: any) => {
			EventBus.on(subscription.type, subscription.listener)
		})
	}
}

export function manageRoute() {
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

window.addEventListener("hashchange", manageRoute)
