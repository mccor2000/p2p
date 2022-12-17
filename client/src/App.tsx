import { Routes, Route } from "react-router-dom";

import { WebSocketProvider, AuthProvider } from "./context-provider";

import Home from "./Home";
import Room from "./modules/room/Room";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
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
