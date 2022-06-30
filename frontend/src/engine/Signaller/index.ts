import { log } from "../Utils"
import { publish } from "../../main"
import { EVENTS } from "../../../../common/constants/EVENTS"
import { Player } from "../../classes/Player"

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

const connect = new Promise((resolve) => {
	socket.onmessage = ({ data }) => {
		const jsonData = JSON.parse(data)
		const type = jsonData.type
		const message = jsonData.payload
		if (type === EVENTS.SIGNALS.SERVER.CREATED_PLAYER) {
			Player.instances.me = new Player({ id: message.id })
			resolve(true)
			log(EVENTS.SIGNALS.SERVER.CREATED_PLAYER, message.id)
			return
		}
		publish(type, message)
	}
})

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
