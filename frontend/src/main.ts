import "./css/main.css"
/* import adapter from "webrtc-adapter"
import * as PIXI from "pixi.js" */
import { manageRoute } from "./engine/Router"

manageRoute()

window.addEventListener("hashchange", manageRoute)
