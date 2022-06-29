export const roomId = ""

let state = ""

export function setState({
	newState,
	payload = {},
}: {
	newState: string
	payload: object
}) {
	state = newState
}
