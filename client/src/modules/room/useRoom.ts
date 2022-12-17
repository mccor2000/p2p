import { useEffect, useRef } from "react"
//@ts-ignore
import Peer from 'simple-peer/simplepeer.min.js'
// import Peer from "simple-peer"

import { Connection } from "../../context-provider"



export type RoomPeer = {
    id: string,
    rtc?: Peer.Instance
}

export const useRoom = (channel?: Connection) => {
    const peers = useRef<RoomPeer[]>([])

    const createRTCPeer = () => {
        if (!channel) return

        const peer = new Peer({ initiator: true, trickle: false })

        peer.on("signal", signal => {
            channel.send("wrtc-offer", { signal });
        });
        peer.on('connect', () => {
            console.log('RTC connected')
        })

        return peer
    }

    const establishRTCPeer = (signal: Peer.SignalData) => {
        if (!channel) return

        const peer = new Peer({ initiator: false, trickle: false });

        peer.on('signal', (signal) => {
            channel.send('wrtc-answer', { signal })
        })
        peer.on('connect', () => {
            console.log('RTC connected')
        })
        peer.signal(signal)

        return peer
    }

    useEffect(() => {
        if (!channel) return

        channel.addListener('user-join', ({ user }) => {
            if (!peers.current.find(m => m.id === user.id)) {
                peers.current.push({
                    id: user.id,
                    rtc: createRTCPeer()
                })
            }
        })

        channel.addListener('user-leave', ({ user }) => {
            // const exist = peers.current.find(p => p.id === user.id)
            // if (exist) {
            // }
            peers.current = peers.current.filter(p => p.id === user.id)
        })

        channel.addListener('wrtc-offer', ({ data, user }) => {
            if (!peers.current.find(m => m.id === user.id)) {
                peers.current.push({
                    id: user.id,
                    rtc: establishRTCPeer(data.signal)
                })
            }
        })

        channel.addListener('wrtc-answer', ({ data, user }) => {
            peers.current.forEach(p => {
                if (p.id === user.id && !p.rtc?.connected) {
                    console.log('got answer from: ', user.displayName)
                    console.log('rtc:', p.rtc)
                    p.rtc.signal(data.signal)
                }
            })
        });
    }, [channel])

    return { peers }
}