///<reference path="types.d.ts" />
import dotenv from "dotenv"
import path from "path"
import { readFileSync } from "fs"
import { createServer as createServerHttp } from "http"
import { createServer as createServerHttps } from "https"
import { randomBytes } from "crypto"
import { WebSocketServer } from "ws"

import { ERRORS } from "../../common/constants/ERRORS"
import { EVENTS } from "../../common/constants/EVENTS"

import { Player, playerId } from "./classes/Player"
import { Room } from "./classes/Room"

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

const SIGNALS = EVENTS.SIGNALS

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

				if (!id) id = randomBytes(16).toString("hex")

				new Player({ id, socket })
				send(SIGNALS.SERVER.CREATED_PLAYER, { id })

				log(SIGNALS.HANDSHAKE)

				break

			case SIGNALS.CLIENT.WANTS_TO_JOIN: {
				const room = Room.find(message.roomId)

				if (!room) {
					send(SIGNALS.ERROR, { text: ERRORS.ROOM_NOT_FOUND.en })
					return
				}

				const host = room.host

				if (!host) {
					send(SIGNALS.ERROR, { text: ERRORS.PLAYER_NOT_FOUND.en })
					return
				} else if (host.enemyId) {
					send(SIGNALS.ERROR, { text: ERRORS.PLAYER_IN_GAME.en })
					return
				}

				currentPlayer.enemyId = host.id
				host.enemyId = currentPlayer.id

				room.clientId = currentPlayer.id

				send(SIGNALS.HOST.SENDS_OFFER_AND_CANDIDATES, {
					offer: host.sdp,
					iceCandidates: host.iceCandidates,
				})

				break
			}
			case SIGNALS.CLIENT.GENERATED_ANSWER: {
				currentPlayer.sdp = message.answer

				send(
					SIGNALS.CLIENT.SENDS_ANSWER,
					{ answer: message.answer },
					currentPlayer.enemy!.socket
				)
				log(SIGNALS.CLIENT.GENERATED_ANSWER)
				break
			}

			case SIGNALS.HOST.WANTS_TO_CREATE_ROOM: {
				currentPlayer.sdp = message.offer

				const room = new Room({ hostId: currentPlayer.id })

				send(SIGNALS.HOST.CREATED_ROOM, { roomId: room.id })

				log(SIGNALS.HOST.WANTS_TO_CREATE_ROOM)
				break
			}

			case SIGNALS.HOST.CANCELLED_ROOM: {
				const room = Room.find(message.roomId)

				room?.delete()

				log(SIGNALS.HOST.CANCELLED_ROOM)
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
//@ts-ignore
global.rooms = Room.instances
