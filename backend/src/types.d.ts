interface WebSocket {
	[playerId: symbol]: string
}

interface PlayerConstructor {
	id: string
	socket: WebSocket
}

interface RoomConstructor {
	hostId: string
}
