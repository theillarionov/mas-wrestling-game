export const SIGNALS = {
	SERVER: {
		CREATED_PLAYER: "server-created-player",
	},
	PEER: {
		GENERATED_OFFER: "peer-generated-offer",
		GENERATED_ANSWER: "peer-generated-answer",
		GENERATED_ICE_CANDIDATE: "peer-generated-ice-candidate",

		WANTS_TO_JOIN: "peer-wants-to-join",

		CANCELLED_ROOM: "peer-cancelled-room",
	},
	REMOTE: {
		GENERATED_ICE_CANDIDATE: "remote-generated-ice-candidate",
		SENDS_OFFER_AND_CANDIDATES: "host-sends-offer-and-candidates",
		SENDS_ANSWER: "remote-sends-answer",
	},
	HANDSHAKE: "handshake",
	ERROR: "error",
}
