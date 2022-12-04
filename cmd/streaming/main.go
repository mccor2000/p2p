package main

import (
	"github.com/anacrolix/torrent"
	"github.com/gin-gonic/gin"
)

var (
	TClient, err = torrent.NewClient(&torrent.ClientConfig{})
)

func main() {

	route := gin.New()

	route.GET("/echo", echo)
	route.GET("/stream", stream)
	route.Run("0.0.0.0:8080")
}

func echo(c *gin.Context) {
	c.String(200, "%v", "0.1")
}

func stream(c *gin.Context) {

}
