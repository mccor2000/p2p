import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./modules/auth";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState<string>("")

  const navigate = useNavigate()

  return user ? (
    <>
      <h1>welcome, {user?.username}</h1>
      <div>
        <input type="text" placeholder="room id" value={room} onChange={(e) => {
          e.preventDefault()
          setRoom(e.target.value)
        }} />
        <button onClick={() => room && navigate("/rooms/" + room)}>join room</button>
      </div>
    </>
  ) : (
    <h1>loading...</h1>
  );
};

export default Home;
