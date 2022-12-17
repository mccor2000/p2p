import WebSocket from "isomorphic-ws";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { AuthContext, User } from "./define-yourself";

export type Listener<Data = unknown> = {
    opcode: string;
    handler: ({ data, user }: { data: any, user: User }) => void;
};

export type Connection = {
    user: User,
    ws: WebSocket,
    send: (opcode: string, data: any) => void
    addListener: (opcode: string, handler: (msg: {data: any, user: User}) => void) => () => void
}

export const connect = (roomId: string, user: User): Promise<Connection> => new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:12313/ws/${roomId}`)

    const listeners: Listener[] = []
    const connection = {
        user,
        ws,
        send: (opcode: string, data: any) => {
            ws.send(JSON.stringify({ opcode, data, user }))
        },
        addListener: (opcode: string, handler: ({ data, user }: { data: any, user: User }) => void) => {
            const listener = { opcode, handler }
            listeners.push(listener);

            // unsubcribe
            return () => listeners.splice(listeners.indexOf(listener), 1);
        }
    }

    ws.addEventListener("open", () => {
        resolve(connection)
    })

    ws.addEventListener("message", ({ data }: { data: any }) => {
        const msg: { opcode: string, data: any, user: User } = JSON.parse(data as string)
        listeners
            .filter(({ opcode }) => opcode === msg.opcode)
            .forEach((l) => l.handler(msg));
    })
})

export const WebSocketContext = createContext<{
    conn?: Connection,
}>({})

export const WebSocketProvider: React.FC = ({ children }) => {
    const { user } = useContext(AuthContext)
    const { roomId } = useParams()
    const [conn, setConn] = useState<Connection>()

    useEffect(() => {
        if (conn || !user) {
            return
        }

        connect(roomId!, user)
            .then(ws => {
                setConn(ws)
            })
            .catch(e => {
                console.log('err connect websocket', e)
            })
            .finally(() => {
                console.log('connect websocket')
            })
    }, [conn, user])

    return (
        <WebSocketContext.Provider
            value={useMemo(() => ({
                conn
            }), [conn])}
        >
            {children}
        </WebSocketContext.Provider>)
}