import { readFileSync } from "fs"
import { createServer } from "http"
import { randomBytes } from "crypto"
import { WebSocketServer } from "ws"

import { Player, playerId } from "./classes/Player"
import { Room } from "./classes/Room"

import { ERRORS } from "../../_constants/ERRORS"
import { SIGNALS } from "../../_constants/SIGNALS"

const server = createServer()

server.listen(80)
