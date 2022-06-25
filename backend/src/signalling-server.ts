import dotenv from "dotenv"
import { readFileSync } from "fs"
import { createServer } from "http"
import { randomBytes } from "crypto"
import { WebSocketServer } from "ws"
import path from "path"

import { ERRORS } from "../../common/constants/ERRORS"
import { SIGNALS } from "../../common/constants/SIGNALS"

import { Player, playerId } from "./classes/Player"
import { Room } from "./classes/Room"

dotenv.config({
	path: path.join(__dirname, "../../common/env/.env." + process.env.NODE_ENV),
})
