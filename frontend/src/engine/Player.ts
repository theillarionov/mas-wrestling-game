export class Player {
	_id: string = ""
	type: "host" | "client" | "" = ""

	constructor({ id }: PlayerConstructor) {
		this.id = id
	}

	get id() {
		return this._id
	}

	set id(value) {
		if (value) {
			this._id = value

			localStorage.setItem("id", this._id)
			document.querySelector("#game-id")!.innerHTML = this._id
		}
	}

	static instances: {
		me: Player | undefined
		enemy: Player | undefined
	} = {
		me: undefined,
		enemy: undefined,
	}
}
// @ts-ignore
window.Player = Player
