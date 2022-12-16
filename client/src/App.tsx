import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./modules/auth";

import Home from "./Home";
import Room from "./modules/room/Room";
import Player from "./Player";
import { WebSocketProvider } from "./modules/ws/context-provider";

const App = () => {
  const torrentId =
    "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent";

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<Player torrentId={torrentId} />} />
        <Route path="/rooms/:roomId" element={
          (<WebSocketProvider>
            <Room />
          </WebSocketProvider>)
        } />
      </Routes>
    </AuthProvider>
  );
};

export default App;
