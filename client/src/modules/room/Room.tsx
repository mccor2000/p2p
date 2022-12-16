import { createRef } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../config";
import { AuthContext, User } from "../auth";
import { useWebRTC } from "../webrtc";

import { WebSocketContext } from "../ws/context-provider";


const Room = () => {
  const { roomId } = useParams<string>();
  const { user } = useContext(AuthContext)
  const { conn } = useContext(WebSocketContext)

  const peerConnection = useRef<RTCPeerConnection>()

  const localMedia = createRef<HTMLVideoElement>()
  const remoteMedia = createRef<HTMLVideoElement>()

  const channel = useRef<RTCDataChannel>()

  // const { initPeerConnection, makeCall, answerCall, addAnswer, localStream, remoteStream } = useWebRTC(conn!)

  // const torrentStream = useRef<MediaStream>()
  // torrentStream.current.


  const localStream = useRef<MediaStream>()
  const remoteStream = useRef<MediaStream>(new MediaStream())

  const initPeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection(config.iceConfig);

    remoteStream.current = new MediaStream()
    remoteMedia.current!.srcObject = remoteStream.current


    if (!localStream.current) {
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      localMedia.current!.srcObject = localStream.current
    }

    localStream.current!.getTracks().forEach(t => peerConnection.current!.addTrack(t))


    peerConnection.current!.ontrack = ({ streams, track }) => {
      console.log('got remote tracks')
      console.log(streams, track)
      remoteStream.current.addTrack(track)
    }
    peerConnection.current!.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.log(candidate)
        conn!.send('wrtc-icecandidate', { candidate })
      }
    }
  }

  const initDataChannel = async () => {
  }

  const makeCall = async () => {
    if (!peerConnection.current) {
      console.log('not found rtc')
      return
    }
    if (!conn) {
      console.log('not found ws')
      return
    }

    console.log('calling..')
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer)

    conn.send('wrtc-offer', { offer })
    console.log('wrtc state:', peerConnection.current.connectionState, peerConnection.current.signalingState)
  }

  const answerCall = async (offer: RTCSessionDescription) => {
    if (!peerConnection.current) {
      console.log('not found rtc, answer')
      return
    }
    if (!conn) {
      console.log('not found ws')
      return
    }

    console.log('answering..')
    await peerConnection.current.setRemoteDescription(offer)

    const answer = await peerConnection.current.createAnswer()
    await peerConnection.current.setLocalDescription(answer)

    conn.send('wrtc-answer', { answer })
    console.log('wrtc state:', peerConnection.current.connectionState, peerConnection.current.signalingState)
  }

  const addAnswer = async (answer: RTCSessionDescription) => {
    if (!peerConnection.current) {
      console.log('not found rtc, save answer')
      return
    }
    if (!conn) {
      console.log('not found ws')
      return
    }

    console.log('got answer')
    if (!peerConnection.current.currentRemoteDescription) {
      await peerConnection.current.setRemoteDescription(answer)
    }
    console.log('wrtc state:', peerConnection.current.connectionState, peerConnection.current?.signalingState)
  }

  useEffect(() => {
    if (!conn || !user) {
      return
    }

    (async () => {
      await initPeerConnection()

      await initDataChannel()

      conn.addListener('wrtc-icecandidate', (msg) => {
        const candidate = new RTCIceCandidate(msg.candidate)
        console.log('got ice candidate')
        if (peerConnection.current) {
          peerConnection.current!.addIceCandidate(candidate)
        }
      })
      conn.addListener('wrtc-offer', (msg) => {
        console.log('got call')
        answerCall(msg.offer)
      })
      conn.addListener('wrtc-answer', (msg) => {
        addAnswer(msg.answer)
      });

      conn.addListener('user_join', ({ user }) => {
        console.log('user join:', user.username)
      })

      conn.send('user_join', { user })
    })()

    return () => {
      conn.send('user_leave', { user })
      conn.close()
    }
  }, [conn, user])

  const whatup = () => {
    if (!peerConnection.current) return

    if (!channel.current) {
      channel.current = peerConnection.current.createDataChannel('room')

      channel.current.onmessage = (e) => {
        console.log(e.data)
      }
    }

    channel.current.send('whatup')
  }

  return (
    <>
      <h1>room {roomId}</h1>
      <div style={{
        display: 'flex',
      }}>
        <video ref={localMedia} autoPlay playsInline
          style={{
            backgroundColor: 'black',
            width: '50%',
          }}
        ></video>
        <video
          style={{
            backgroundColor: 'black',
            width: '50%',
          }}
          ref={remoteMedia} autoPlay playsInline></video>
      </div>
      <button onClick={() => makeCall()}>make call</button>
      {/* <video ref={torrentStream}></video> */}
      <button onClick={whatup}>whatup</button>
    </>
  );
};

export default Room;
