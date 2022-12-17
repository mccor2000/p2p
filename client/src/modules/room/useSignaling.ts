import { useContext } from "react"
import { WebSocketContext } from "../../context-provider"

export const useSignaling = () => {
    return useContext(WebSocketContext)
}