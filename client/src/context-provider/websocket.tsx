import WebSocket from "isomorphic-ws";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { AuthContext, User } from "./define-yourself";

export type Listener = {
    opcode: string;
    handler: ({ data, user }: { data: any, user: User }) => void;
};

export type Connection = {
    user: User,
    ws: WebSocket,
    send: (opcode: string, data: any) => void
    addListener: (opcode: string, handler: (msg: { data: any, user: User }) => void) => () => void
}

export const connect = (roomId: string, user: User): Promise<Connection> => new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:12313/ws/${roomId}`)

    const listeners: Listener[] = []
    const connection = {
        user,
        ws,
        send: (opcode: string, data: any) => {
            const msg = JSON.stringify({ opcode, data, user })
            ws.send(msg)
        },
        addListener: (opcode: string, handler: ({ data, user }: { data: any, user: User }) => void) => {
            const listener = { opcode, handler }
            listeners.push(listener);
            return () => listeners.splice(listeners.indexOf(listener), 1);
        }
    }

    ws.addEventListener("open", () => {
        console.log('ws connected')
        resolve(connection)
    })
    ws.addEventListener("close", ({ wasClean, reason, target, code, type }) => {
        console.log(`ws closed: ${reason}, code: ${code}, type: ${type}`, wasClean)
        target.close()
    })

    ws.addEventListener("message", ({ data }: { data: any }) => {
        const msg: { opcode: string, data: any, user: User } = JSON.parse(data as string)
        listeners
            .filter(({ opcode }) => opcode === msg.opcode)
            .forEach((l) => l.handler(msg));
    })
})

export const WebSocketContext = createContext<{
    connected: boolean
    channel?: Connection,
}>({
    connected: false
})

export const WebSocketProvider: React.FC = ({ children }) => {
    const { user } = useContext(AuthContext)
    const { roomId } = useParams()
    const conn = useRef<Connection>()
    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        if (!user) return

        (async () => {
            conn.current = await connect(roomId!, user)
            setConnected(true)
        })()
    }, [user])

    return (
        <WebSocketContext.Provider
            value={useMemo(() => ({
                connected,
                channel: conn.current
            }), [conn.current])}
        >
            {children}
        </WebSocketContext.Provider>)
}