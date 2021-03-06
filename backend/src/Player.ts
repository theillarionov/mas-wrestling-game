import { randomBytes } from "crypto"

export const playerId = Symbol("playerId")

export class Player {
	id: string
	socket: WebSocket

	sdp: string | null = null
	iceCandidates: RTCIceCandidate[] = []
	enemyId: string | null = null
	accepting_connections = false

	constructor({ id, socket }: PlayerConstructor) {
		this.id = id

		socket[playerId] = id
		this.socket = socket

		Player.instances.set(this.id, this)
	}

	reset() {
		this.enemyId = null
		this.accepting_connections = false
	}

	delete() {
		Player.instances.delete(this.id)
	}

	get enemy(): Player | undefined {
		return this.enemyId ? Player.instances.get(this.enemyId) : undefined
	}

	get hasEnemy(): boolean {
		return this.enemyId ? true : false
	}

	static instances: Map<string, Player> = new Map()

	static find(id: string): Player | undefined {
		return Player.instances.get(id)
	}

	static generateId(): string {
		const id = randomBytes(4).toString("base64url")
		return Player.instances.has(id) ? Player.generateId() : id
	}
}
