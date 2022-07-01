import { log } from "./Utils"
import { publish } from "../engine/EventManager"
import { EVENTS } from "../../../common/constants/EVENTS"
import { Player } from "./Player"

const socket = new WebSocket(
	import.meta.env.WS_SCHEMA +
		import.meta.env.WS_ADDRESS +
		":" +
		import.meta.env.WS_PORT
)

socket.onopen = () => {
	socket.send(
		JSON.stringify({
			type: EVENTS.SIGNALS.HANDSHAKE,
			payload: { id: localStorage.getItem("id") },
		})
	)
}

socket.onclose = (e) => {
	log("close from client", e)
}

socket.onerror = (e) => {
	log("error from client", e)
}

const connect = new Promise((resolve) => {
	socket.onmessage = ({ data }) => {
		const jsonData = JSON.parse(data)
		const type = jsonData.type
		const message = jsonData.payload
		if (type === EVENTS.SIGNALS.SERVER.CREATED_PLAYER) {
			Player.instances.me = new Player({ id: message.id })
			log(EVENTS.SIGNALS.SERVER.CREATED_PLAYER, message.id)
			resolve(true)
			return
		}
		publish(type, message)
	}
})

export function sendSignal(type: string, payload: object = {}) {
	connect.then(() => {
		socket.send(JSON.stringify({ type, payload }))
	})
}
