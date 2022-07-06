export class Game {
	roomId: string

	constructor({ roomId }: GameConstructor) {
		this.roomId = roomId
		Game.instance = this
	}

	static delete() {
		Game.instance = null
	}

	static instance: Game | null = null
}
