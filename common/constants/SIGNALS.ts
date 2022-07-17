export const SIGNALS = {
	SERVER: {
		CREATED_PLAYER: "server-created-player",
	},
	PEER: {
		GENERATED_ANSWER: "peer-generated-answer",
		GENERATED_ICE_CANDIDATE: "peer-generated-ice-candidate",

		STARTED_ACCEPTING_CONNECTIONS: "peer-started-accepting-connections",
		STOPPED_ACCEPTING_CONNECTIONS: "peer-stopped-accepting-connections",

		WANTS_TO_JOIN: "peer-wants-to-join",
	},
	REMOTE: {
		GENERATED_ICE_CANDIDATE: "remote-generated-ice-candidate",
		SENDS_OFFER_AND_CANDIDATES: "host-sends-offer-and-candidates",
		SENDS_ANSWER: "remote-sends-answer",

		DISCONNECTED: "remote-disconnected",
	},
	HANDSHAKE: "handshake",
	ERROR: "error",
}
