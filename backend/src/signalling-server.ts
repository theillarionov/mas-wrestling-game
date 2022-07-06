///<reference path="types.d.ts" />
import dotenv from "dotenv"
import path from "path"
import { readFileSync } from "fs"
import { createServer as createServerHttp } from "http"
import { createServer as createServerHttps } from "https"
import { WebSocketServer } from "ws"

import { ERRORS } from "../../common/constants/ERRORS"
import { SIGNALS } from "../../common/constants/SIGNALS"

import { Player, playerId } from "./classes/Player"

dotenv.config({
	path: path.join(__dirname, "../../common/env/.env." + process.env.NODE_ENV),
})

const isProduction = process.env.NODE_ENV === "production"
const useHttps = isProduction

const server = useHttps
	? createServerHttps({
			cert: readFileSync("pem"),
			key: readFileSync("pem"),
	  })
	: createServerHttp()

const wss = new WebSocketServer({ server })

wss.on("error", (e) => {
	console.log("wss error", e)
})

wss.on("connection", (socket: WebSocket) => {
	socket.onerror = (e) => {
		log("socket error")
	}

	socket.onclose = () => {
		Player.find(socket[playerId])!.delete()
		log("close")
	}

	socket.onmessage = (data: any) => {
		data = JSON.parse(data.data)
		const type = data.type
		const message = data.payload

		const currentPlayer = Player.find(socket[playerId])!

		switch (type) {
			case SIGNALS.HANDSHAKE:
				let id = message.id

				if (!id) id = Player.generateId()

				new Player({ id, socket })
				send(SIGNALS.SERVER.CREATED_PLAYER, { id })

				log(SIGNALS.HANDSHAKE)

				break

			case SIGNALS.PEER.WANTS_TO_JOIN: {
				const host = Player.find(message.hostId)

				if (!host) {
					send(SIGNALS.ERROR, { text: ERRORS.PLAYER_NOT_FOUND.en })
					return
				} else if (!host.accepting_connections) {
					send(SIGNALS.ERROR, {
						text: ERRORS.PLAYER_NOT_ACCEPTING_CONNECTIONS.en,
					})
					return
				}

				currentPlayer.enemyId = host.id
				host.enemyId = currentPlayer.id

				send(SIGNALS.REMOTE.SENDS_OFFER_AND_CANDIDATES, {
					offer: host.sdp,
					iceCandidates: host.iceCandidates,
				})

				break
			}
			case SIGNALS.PEER.GENERATED_ANSWER: {
				currentPlayer.sdp = message.answer

				send(
					SIGNALS.REMOTE.SENDS_ANSWER,
					{ answer: message.answer },
					currentPlayer.enemy!.socket
				)
				log(SIGNALS.PEER.GENERATED_ANSWER)
				break
			}

			case SIGNALS.PEER.STARTED_ACCEPTING_CONNECTIONS: {
				currentPlayer.sdp = message.offer
				currentPlayer.accepting_connections = true

				log(SIGNALS.PEER.STARTED_ACCEPTING_CONNECTIONS)
				break
			}

			case SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS: {
				currentPlayer.accepting_connections = false

				log(SIGNALS.PEER.STOPPED_ACCEPTING_CONNECTIONS)
				break
			}

			case SIGNALS.PEER.GENERATED_ICE_CANDIDATE:
				currentPlayer.iceCandidates.push(message.iceCandidate)
				if (currentPlayer.enemyId) {
					send(
						SIGNALS.REMOTE.GENERATED_ICE_CANDIDATE,
						{ iceCandidate: message.iceCandidate },
						currentPlayer.enemy!.socket
					)
				}
				log(SIGNALS.PEER.GENERATED_ICE_CANDIDATE)
				break
		}
	}

	function send(type: string, payload: object, sender = socket) {
		sender.send(JSON.stringify({ type, payload }))
	}

	function log(text: string) {
		console.log(
			text + " by " + socket[playerId]
			//socket[peer]
		)
	}
})

server.listen(process.env.WS_PORT, () => {
	console.log(
		"Signalling server running on " +
			process.env.WS_SCHEMA +
			process.env.WS_ADDRESS +
			":" +
			process.env.WS_PORT
	)
})

//@ts-ignore
global.players = Player.instances
