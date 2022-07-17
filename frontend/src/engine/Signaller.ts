import { log } from "./Utils"
import { EventBus } from "./Events"
import { SIGNALS } from "../../../common/constants/SIGNALS"
import { Player } from "./Player"

const socket = new WebSocket(
	(import.meta.env.DEV ? "ws://" : "wss://") +
		import.meta.env.GAME_WEBSOCKET_SERVER +
		":" +
		import.meta.env.GAME_WEBSOCKET_PORT
)

socket.onopen = () => {
	socket.send(
		JSON.stringify({
			type: SIGNALS.HANDSHAKE,
			payload: { id: localStorage.getItem("id") },
		})
	)
}

socket.onclose = (e) => {
	log("socket.close", e)
}

socket.onerror = (e) => {
	log("socket.error", e)
}

const connect = new Promise((resolve) => {
	socket.onmessage = ({ data }) => {
		const jsonData = JSON.parse(data)
		const type = jsonData.type
		const message = jsonData.payload
		if (type === SIGNALS.SERVER.CREATED_PLAYER) {
			Player.instances.me = new Player({ id: message.id })
			log(SIGNALS.SERVER.CREATED_PLAYER, message.id)
			resolve(true)
			return
		} else if (type === SIGNALS.ERROR) {
			log(SIGNALS.ERROR, message)
		}
		EventBus.emit(type, message)
	}
})

export function sendSignal(type: string, payload: object = {}) {
	connect.then(() => {
		socket.send(JSON.stringify({ type, payload }))
	})
}
