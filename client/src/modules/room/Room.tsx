import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from 'styled-components'

import { YoutubePlayer } from "../../components/Player";

import { useRoom } from "./useRoom";
import { useSignaling } from "./useSignaling";

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
  const { connected, channel } = useSignaling()
  const { peers } = useRoom(channel)
  const [mems, setMems] = useState<{ id: string, displayName: string }[]>([])

  useEffect(() => {
    if (!channel) return

    // some how this shit blocking 
    // the WebRTC connection for a while?????

    // channel.addListener('user-join', ({ user }) => {
    //   !mems.includes(user) && setMems(_mems => [..._mems, user])
    // })
    // channel.addListener('user-leave', ({ user }) => {
    //   mems.includes(user) && setMems(_mems => _mems.filter(m => m.id === user.id))
    // })

    channel.send('user-join', {})

    return () => {
      channel.send('user-leave', {})
      channel.ws.close()
    }
  }, [channel])

  return connected ? (
    <>
      <h1>room {roomId}</h1>
      <Container>
        <LeftRow>
          <h2>peers</h2>
          {[...mems, { id: channel?.user.id, displayName: channel?.user.displayName }].map(p => <h3 key={p.id}>{p.displayName}</h3>)}
          {/* <Video autoPlay playsInline ref={localMedia} />
          <Video autoPlay playsInline ref={remoteMedia} /> */}
        </LeftRow>
        <RightRow>
          {/* <YoutubePlayer id={videoID} />
          <input type="text" placeholder="video link" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
          <button onClick={() => { setVideoID(videoUrl.split("=")[1]) }}>Load video</button> */}
        </RightRow>
      </Container>
    </>
  ) : <>connecting..</>
};

export default Room;
