const config = {
  websocketUrl: "ws://localhost:12313/ws",
  webtorrent: {
    // maxConns: 4,
    // tracker: false,
  },
  iceConfig: {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    // iceCandidatePoolSize: 10,
  },
};

export default config;
