import "./css/main.css"
/* import adapter from "webrtc-adapter"
import * as PIXI from "pixi.js" */
import { manageRoute } from "./engine/Router"
import { send } from "./engine/Signaller"

manageRoute()
send("handshake", { id: localStorage.getItem("id") })
