export const EVENTS = {
	SIGNALS: {
		SERVER: {
			CREATED_PLAYER: "server-created-player",
		},
		CLIENT: {
			GENERATED_ANSWER: "client-generated-answer",
			SENDS_ANSWER: "client-sends-answer",

			ASKS_TO_JOIN: "client-asks-to-join",
		},
		HOST: {
			GENERATED_OFFER: "host-generated-offer",
			SENDS_OFFER_AND_CANDIDATES: "host-sends-offer-and-candidates",

			CREATED_ROOM: "host-created-room",
			CANCELLED_ROOM: "host-cancelled-room",
		},
		PEER: {
			GENERATED_ICE_CANDIDATE: "peer-generated-ice-candidate",
		},
		REMOTE: {
			GENERATED_ICE_CANDIDATE: "remote-generated-ice-candidate",
		},
		HANDSHAKE: "handshake",
		ERROR: "error",
	},
	ROUTER: {
		ROUTE_OPENED: "route-opened",
		ROUTE_LEFT: "route-left",
	},
}