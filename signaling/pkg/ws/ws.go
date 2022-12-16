package ws

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func HandleWS(w http.ResponseWriter, r *http.Request, h *Hub, roomId string) {
	conn, err := wsupgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("failed to upgrade websocket: %+v", err)
		return
	}

	c := &Client{
		ID:   "asdf",
		Room: roomId,

		conn: conn,
		h:    h,
		send: make(chan []byte),
	}

	h.register <- c

	go c.writePump()
	go c.readPump()
}
