import { useEffect, useRef } from "react"
//@ts-ignore
import Peer from 'simple-peer/simplepeer.min.js'

import { Connection } from "../../context-provider"


export const useWebRTC = (conn?: Connection) => {
    const peer = useRef<Peer.Instance>()

    const makeCall = () => {
        if (!conn || peer.current) return

        peer.current = new Peer({ initiator: true, trickle: false })

        peer.current.on("signal", signal => {
            conn.send("wrtc-offer", { signal });
        });
        peer.current.on('connect', () => {
            console.log('RTC connected')
        })
    }

    const answerCall = (signal: Peer.SignalData) => {
        if (!conn || peer.current) return

        peer.current = new Peer({ initiator: false, trickle: false });

        peer.current.on('signal', (signal) => {
            conn.send('wrtc-answer', { signal })
        })
        peer.current.signal(signal)
    }

    useEffect(() => {
        if (!conn) return

        conn.addListener('user-join', ({ user }) => {
            console.log('user join:', user.displayName)
        })

        conn.addListener('wrtc-offer', ({data, user }) => {
            console.log('get call:', user.displayName)
            answerCall(data.signal)
        })

        conn.addListener('wrtc-answer', ({ data, user }) => {
            console.log('get answer:', user.displayName)
            peer.current?.signal(data.signal)
        });


        conn.send('user-join', {})

        return () => {
            if (conn.ws) {
                conn.ws.close()
            }
        }
    }, [conn])

    // const peerConnection = useRef<RTCPeerConnection>()

    // const localStream = useRef<MediaStream>()
    // const remoteStream = useRef<MediaStream>(new MediaStream())

    // const localMedia = createRef<HTMLVideoElement>()
    // const remoteMedia = createRef<HTMLVideoElement>()

    // const initPeerConnection = async () => {
    //     peerConnection.current = new RTCPeerConnection(config.iceConfig);

    //     remoteStream.current = new MediaStream()
    //     remoteMedia.current!.srcObject = remoteStream.current


    //     if (!localStream.current) {
    //         localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //         localMedia.current!.srcObject = localStream.current
    //     }

    //     localStream.current!.getTracks().forEach(t => peerConnection.current!.addTrack(t))


    //     peerConnection.current!.ontrack = ({ streams, track }) => {
    //         remoteStream.current.addTrack(track)
    //     }
    //     peerConnection.current!.onicecandidate = ({ candidate }) => {
    //         if (candidate) {
    //             conn!.send('wrtc-icecandidate', { candidate })
    //         }
    //     }
    // }

    // const makeCall = async () => {
    //     if (!peerConnection.current || !conn) {
    //         return
    //     }

    //     const offer = await peerConnection.current.createOffer();
    //     await peerConnection.current.setLocalDescription(offer)

    //     conn.send('wrtc-offer', { offer })
    // }

    // const answerCall = async (offer: RTCSessionDescription) => {
    //     if (!peerConnection.current || !conn) {
    //         return
    //     }

    //     await peerConnection.current.setRemoteDescription(offer)

    //     const answer = await peerConnection.current.createAnswer()
    //     await peerConnection.current.setLocalDescription(answer)

    //     conn.send('wrtc-answer', { answer })
    // }

    // const addAnswer = async (answer: RTCSessionDescription) => {
    //     if (!peerConnection.current || !conn) {
    //         return
    //     }

    //     if (!peerConnection.current.currentRemoteDescription) {
    //         await peerConnection.current.setRemoteDescription(answer)
    //     }
    // }

    // useEffect(() => {
    //     if (!conn) {
    //         return
    //     }

    //     initPeerConnection().then(() => {
    //         conn.addListener('wrtc-icecandidate', (msg) => {
    //             const candidate = new RTCIceCandidate(msg.candidate)
    //             if (peerConnection.current) {
    //                 peerConnection.current!.addIceCandidate(candidate)
    //             }
    //         })
    //         conn.addListener('wrtc-offer', (msg) => {
    //             answerCall(msg.offer)
    //         })
    //         conn.addListener('wrtc-answer', (msg) => {
    //             addAnswer(msg.answer)
    //         });

    //         conn.addListener('user_join', (msg) => {
    //             console.log('user join:', msg)
    //         })
    //         conn.addListener('user_leave', (msg) => {
    //             console.log('user leave:', msg)
    //         })

    //         conn.send('user_join', { user: conn.user })
    //     }).catch(e => {
    //         console.log('err setting up peer connection')
    //     })

    //     return () => {
    //         conn.send('user_leave', { user: conn.user })
    //         if (conn.ws) {
    //             conn.ws.removeAllListeners('message')
    //             conn.ws.close()
    //         }
    //     }
    // }, [conn])

    return { makeCall }
}