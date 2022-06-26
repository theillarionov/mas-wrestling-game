import { routes } from "./routes"

let currentRoute: route
let previousRoute: route

export function manageRoute() {
	currentRoute = getCurrentRoute()

	callRouteHooks()
	switchSections()

	previousRoute = currentRoute
}

function getCurrentRoute(): route {
	let currentRouteName = ""
	if (location.hash) {
		const hashRoute = location.hash?.replace("#", "")
		if (routes[hashRoute]) currentRouteName = hashRoute
	}
	if (!currentRouteName) currentRouteName = "main-menu"
	return routes[currentRouteName]
}

function switchSections() {
	let sectionClass =
		currentRoute.url === "practice" ? "game" : currentRoute.url
	document.querySelector(".section.active")?.classList.remove("active")
	document.querySelector(".section_" + sectionClass)?.classList.add("active")
}

function callRouteHooks() {
	if (previousRoute && previousRoute.onLeave) previousRoute.onLeave()
	if (currentRoute.onEnter) currentRoute.onEnter()
}

window.addEventListener("hashchange", manageRoute)
