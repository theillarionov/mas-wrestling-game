export const socket = new WebSocket(
	import.meta.env.WS_SCHEMA +
		import.meta.env.WS_ADDRESS +
		":" +
		import.meta.env.WS_PORT
)

export function send(type: string, payload: object) {
	socket.send(JSON.stringify({ type, payload }))
}
