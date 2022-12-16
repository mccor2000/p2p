import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext, User } from "../auth";
import { connect, Connection } from "./websocket";

export const WebSocketContext = createContext<{
    conn: Connection | null,
}>({
    conn: null
})

export const WebSocketProvider: React.FC = ({ children }) => {
    const { user } = useContext(AuthContext)
    const { roomId } = useParams()
    const [conn, setConn] = useState<Connection | null>(null)

    useEffect(() => {
        if (!conn && user) {
            connect(roomId!, user)
                .then(conn => {
                    console.log('reconnect')
                    setConn(conn)
                })
                .catch(e => console.log(e))
        }
    }, [user, conn])

    return (
        <WebSocketContext.Provider
            value={useMemo(() => ({
                conn
            }), [conn])}
        >
            {children}
        </WebSocketContext.Provider>)
}