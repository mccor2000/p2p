import { useContext } from "react"
import { WebSocketContext } from "../../context-provider"

export const useWebSocket = () => {
    return useContext(WebSocketContext)
}