import { randomBytes } from "crypto"
import { Player } from "./Player"

export class Room {
	id: string
	hostId: string
	clientId: string | null = null

	constructor({ hostId }: RoomConstructor) {
		this.id = randomBytes(4).toString("base64url")
		this.hostId = hostId

		Room.instances.set(this.id, this)
	}

	get host(): Player | undefined {
		return Player.instances.get(this.hostId)
	}

	get client(): Player | undefined {
		return this.clientId ? Player.instances.get(this.clientId) : undefined
	}

	static instances: Map<string, Room> = new Map()

	static find(id: string): Room | undefined {
		return Room.instances.get(id)
	}
}
