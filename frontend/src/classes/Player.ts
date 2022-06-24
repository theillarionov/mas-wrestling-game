export class Player {
	_id: string | null = null

	constructor() {
		this.id = localStorage.getItem("id")
	}

	get id() {
		return this._id
	}

	set id(value) {
		if (value) {
			this._id = value

			localStorage.setItem("id", this._id)
			document.querySelector("#id")!.innerHTML = this._id
		}
	}
}
