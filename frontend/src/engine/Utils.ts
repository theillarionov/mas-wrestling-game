export function log(message: string, body: any = {}) {
	console.log(message, body)

	const logDiv = document.querySelector("#log")
	if (!logDiv!.innerHTML) logDiv!.innerHTML = ""

	logDiv!.innerHTML += `<p><b>${message}</b>: ${JSON.stringify(body)}</p>`
}
