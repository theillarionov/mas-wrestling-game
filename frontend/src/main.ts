import "./style.css"
// @ts-ignore
import adapter from "webrtc-adapter"
// @ts-ignore
//import * as PIXI from "pixi.js"
import { MESSAGES } from "../../backend/constants/MESSAGES"

console.log(MESSAGES)

const app = document.querySelector<HTMLDivElement>("#app")!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
