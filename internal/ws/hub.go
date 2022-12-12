package ws

import (
	"fmt"
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
			// register client to the hub
			fmt.Printf("room: %s, user:%s join", c.Room, c.ID)
			room := h.rooms[c.Room]
			if room == nil {
				room = make(map[*Client]bool)
				h.rooms[c.Room] = room
			}
			h.rooms[c.Room][c] = true
			// and also notify the room
			// TODO

		case c := <-h.unregister:
			// unregister
			fmt.Printf("room: %s, user:%s leave", c.Room, c.ID)
			room := h.rooms[c.Room]
			// will this gonn happen??
			if room != nil {
				if _, ok := room[c]; ok {
					delete(room, c)
					close(c.send)

					if len(room) == 0 {
						delete(h.rooms, c.Room)
					} else {
						// notify the room
						// TODO
					}
				}
			}

		case m := <-h.broadcast:
			room := h.rooms[m.from.Room]
			for s := range room {
				select {
				case s.send <- m.payload:
				default:
					close(s.send)
					delete(room, s)
					if len(room) == 0 {
						delete(h.rooms, m.from.Room)
					}
				}
			}
		}

	}
}
