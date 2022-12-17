import { useState, useEffect, useRef } from "react"

import {Connection} from './websocket'
import config from "../config"

export const useWebRTC = (channel: Connection) => {

    const [localStream, setLocalStream] = useState<MediaStream>()
    const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream())

    const initPeerConnection = async () => {
        const peerConnection = new RTCPeerConnection(config.iceConfig);

        localStream?.getTracks().forEach(t => peerConnection.addTrack(t, localStream))

        peerConnection.ontrack = ({ streams }) => {
            streams[0].getTracks().forEach(t => remoteStream.addTrack(t))
        }
        peerConnection.onicecandidate = ({ candidate }) => {
            candidate && channel.send('wrtc-icecandidate', { candidate })
        }

        return peerConnection
    }

    const makeCall = async (rtc: RTCPeerConnection) => {
        if (!rtc) {
            console.log('not found rtc')
            return
        }

        console.log('calling..')
        const offer = await rtc.createOffer();
        await rtc.setLocalDescription(offer)

        channel.send('wrtc-offer', { offer })
        console.log('wrtc state:', rtc.connectionState, rtc?.signalingState)
    }

    const answerCall = async (rtc: RTCPeerConnection, offer: RTCSessionDescription) => {
        if (!rtc) {
            console.log('not found rtc, answer')
            return
        }

        console.log('answering..')
        await rtc.setRemoteDescription(offer)

        const answer = await rtc.createAnswer()
        await rtc.setLocalDescription(answer)

        channel.send('wrtc-answer', { answer })
        console.log('wrtc state:', rtc.connectionState, rtc?.signalingState)
    }

    const addAnswer = async (rtc: RTCPeerConnection, answer: RTCSessionDescription) => {
        if (!rtc) {
            console.log('not found rtc, save answer')
            return
        }

        console.log('got answer')
        if (!rtc.currentRemoteDescription) {
            rtc.setRemoteDescription(answer)
        }
        console.log('wrtc state:', rtc.connectionState, rtc?.signalingState)
    }

    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            setLocalStream(stream)
        })()
    }, [])


    return { initPeerConnection, makeCall, answerCall, addAnswer, localStream, remoteStream }
}