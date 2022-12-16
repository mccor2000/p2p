import WebSocket from "isomorphic-ws";
import { User } from "../auth";

export type Listener<Data = unknown> = {
  opcode: string;
  handler: (data: Data) => void;
};

export type Connection = {
  user: User,
  ws: WebSocket,
  send: (opcode: string, data: any) => void
  addListener: (opcode: string, handler: (data: any) => void) => () => void
  close: () => void,
}

export const connect = (roomId: string, user: User): Promise<Connection> => new Promise((resolve, reject) => {
  const ws = new WebSocket(`ws://localhost:12313/ws/${roomId}`)

  const listeners: Listener[] = []
  const connection = {
    user,
    ws,
    send: (opcode: string, data: any) => {
      console.log(JSON.stringify({ opcode, data, user}).length)
      ws.send(JSON.stringify({ opcode, data, user }))
    },
    addListener: (opcode: string, handler: (data: any) => void) => {
      const listener = { opcode, handler }
      listeners.push(listener);

      // unsubcribe
      return () => listeners.splice(listeners.indexOf(listener), 1);
    },
    close: () => {
      ws.removeAllListeners("message")
      ws.close()
    },
  }

  ws.addEventListener("open", () => {
    resolve(connection)
  })

  ws.addEventListener("message", ({ data }) => {
    const msg = JSON.parse(data as string)

    listeners
      .filter(({ opcode }) => opcode === msg.opcode)
      .forEach((l) =>
        l.handler(msg.data)
      );
  })
})