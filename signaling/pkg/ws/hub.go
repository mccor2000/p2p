package ws

import (
	"log"
)

type Hub struct {
	rooms      map[string]map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan Message
}

func NewHub() *Hub {
	return &Hub{
		rooms:      make(map[string]map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan Message),
	}

}

func (h *Hub) Run() {
	for {
		select {
		case c := <-h.register:
			room := h.rooms[c.Room]
			if room == nil {
				room = make(map[*Client]bool)
				h.rooms[c.Room] = room
			}
			h.rooms[c.Room][c] = true

		case c := <-h.unregister:
			log.Printf("room: %s, user leave\n", c.Room)
			room := h.rooms[c.Room]
			// will this gonn happen??
			if room != nil {
				if _, ok := room[c]; ok {
					delete(room, c)
					close(c.send)

					if len(room) == 0 {
						delete(h.rooms, c.Room)
					}
				}
			}

		case m := <-h.broadcast:
			room := h.rooms[m.from.Room]
			for s := range room {
				if m.from != s {
					select {
					case s.send <- m.payload:
					default:
						// close(s.send)
						// delete(room, s)
						if len(room) == 0 {
							delete(h.rooms, m.from.Room)
						}
					}
				}
			}
		}
	}
}
