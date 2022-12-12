package main

import (
	"github.com/gin-gonic/gin"
	"github.com/mccor2000/torrent-together/internal/ws"
)

func main() {
	r := gin.Default()
	h := ws.NewHub()

	r.GET("/ws/:roomId", func(c *gin.Context) {
		rid := c.Param("roomId")
		ws.HandleWS(c.Writer, c.Request, h, rid)
	})

	go h.Run()
	r.Run("localhost:12313")
}
