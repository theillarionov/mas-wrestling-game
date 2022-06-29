import { log } from "./Utils"
import { publish } from "../main"

const socket = new WebSocket(
	import.meta.env.WS_SCHEMA +
		import.meta.env.WS_ADDRESS +
		":" +
		import.meta.env.WS_PORT
)

const connect = new Promise((resolve, reject) => {
	socket.onopen = () => {
		resolve(true)
	}
})

socket.onmessage = ({ data }) => {
	const jsonData = JSON.parse(data)
	publish(jsonData.type, jsonData.payload)
}

socket.onclose = (e) => {
	log("close from client", e)
}

socket.onerror = (e) => {
	log("error from client", e)
}

export function send(type: string, payload: object = {}) {
	connect.then(() => {
		socket.send(JSON.stringify({ type, payload }))
	})
}
