import { createRef } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import styled from 'styled-components'
import { YoutubePlayer } from "../../components/Player";

import config from "../../config";

import { WebSocketContext, AuthContext } from "../../context-provider";
import { useWebRTC } from "./useWebRTC";
import { useWebSocket } from "./useWebSocket";

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: row;
`;

const LeftRow = styled.div`
    width: 40%;
    height: 100%;
`;

const RightRow = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Video = styled.video`
    height: 50%;
    width: 100%;
    border: 1px solid black;
`;

const Room = () => {
  const { roomId } = useParams()
  const { conn } = useWebSocket()
  const { makeCall } = useWebRTC(conn)

  const [videoUrl, setVideoUrl] = useState<string>("")
  const [videoID, setVideoID] = useState<string>("")

  return (
    <>
      <h1>room {roomId}</h1>
      <Container>
        <LeftRow>
          {/* <Video autoPlay playsInline ref={localMedia} />
          <Video autoPlay playsInline ref={remoteMedia} /> */}
        </LeftRow>
        <RightRow>
          <YoutubePlayer id={videoID} />
          <input type="text" placeholder="video link" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
          <button onClick={() => { setVideoID(videoUrl.split("=")[1]) }}>Load video</button>
        </RightRow>
      </Container>
      <button onClick={() => makeCall()}>make call</button>
    </>
  );
};

export default Room;
