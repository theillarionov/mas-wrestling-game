import { Room } from "./Room"

export const playerId = Symbol("playerId")

export class Player {
	id: string
	socket: WebSocket

	sdp: string | null = null
	iceCandidates: RTCIceCandidate[] = []
	enemyId: string | null = null
	roomId: string | null = null

	constructor({ id, socket }: PlayerConstructor) {
		this.id = id

		socket[playerId] = id
		this.socket = socket

		Player.instances.set(this.id, this)
	}

	delete(): void {
		Player.instances.delete(this.id)
	}

	get enemy(): Player | undefined {
		return this.enemyId ? Player.instances.get(this.enemyId) : undefined
	}

	get room(): Room | undefined {
		return this.roomId ? Room.instances.get(this.roomId) : undefined
	}

	static instances: Map<string, Player> = new Map()

	static find(id: string): Player | undefined {
		return Player.instances.get(id)
	}
}
