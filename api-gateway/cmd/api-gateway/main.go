package main

import (
	"github.com/Pallinder/go-randomdata"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	store, _ := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
	r.Use(sessions.Sessions("user", store))
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowWebSockets:  true,
		AllowMethods:     []string{"*"},
	}))

	r.GET("/auth", func(c *gin.Context) {
		session := sessions.Default(c)

		if session.Get("username") == nil {
			session.Set("username", randomdata.SillyName())
			session.Save()
		}

		c.JSON(200, gin.H{
			"id":       session.ID(),
			"username": session.Get("username"),
		})
	})

	r.Run("localhost:8080")
}
