export const router: router = {
	currentRoute: {},
	previousRoute: {},

	manageRoute() {
		let routeName
		if (location.hash) {
			const hashRoute = location.hash?.replace("#", "")
			if (router.routes[hashRoute]) routeName = hashRoute
		}
		if (!routeName) routeName = "main-menu"
		router.currentRoute = router.routes[routeName]

		if (router.previousRoute && router.previousRoute.onLeave)
			router.previousRoute.onLeave()
		if (router.currentRoute.onEnter) router.currentRoute.onEnter()

		document.querySelector(".section.active")?.classList.remove("active")
		document.querySelector(".section_" + routeName)?.classList.add("active")

		router.previousRoute = router.routes[routeName]
	},
	init() {
		router.manageRoute()
		window.addEventListener("hashchange", router.manageRoute)
	},

	routes: {
		"main-menu": {
			onEnter() {
				console.log("main menu enter")
			},
			onLeave() {
				console.log("main-menu leave")
			},
		},
		"join-game": {},
		"create-game": {
			onEnter() {
				console.log("create game enter")
			},
			onLeave() {
				console.log("create game leave")
			},
		},
		practice: {},
		game: {},
	},
}

window.router = router
