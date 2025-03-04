import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setRoomData } from '../Redux/slice';
import { socket } from './Socket';

export function GameLobby() {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"))
  const handleLogout = () => {
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.clear()
    navigate("/")
  }

  const createRoom = (gameType) => {
    const playerID = user?._id || Math.random().toString(36).substring(2, 10);
    socket.emit("createRoom", { gameType, playerID });

    socket.on("roomCreated", ({ roomId }) => {
      dispatch(setRoomData({ roomId, gameType, players: [playerID] }));
      navigate(`/room/${roomId}`);
    });
  };

  const joinRoom = () => {
    if (!roomId) return alert("Enter Room ID!");
    const playerID = user?._id || Math.random().toString(36).substring(2, 10);

    socket.emit("joinRoom", { roomId, playerID });

    socket.on("playerJoined", ({ players }) => {
      dispatch(setRoomData({ roomId, players }));
      navigate(`/room/${roomId}`);
    });

    socket.on("error", (msg) => alert(msg));
  };

  return (
    <div className='gameLobby' >
      <div className="navBar">
        {user?.isAdmin && <p className='dashboard' onClick={() => navigate("/adminDash")}>ADMIN DASHBOARD</p>}
        <p className='logout' onClick={handleLogout} >LOGOUT</p>
      </div>
      <div className="lobby">
        <h2 onClick={() => createRoom("TicTacToe")}>TIC-TAC-TOE</h2>
        <h2 onClick={() => createRoom("RockPaperScissors")}>ROCK-PAPER-SCISSORS</h2>
        <h2 onClick={() => navigate("/SnakeGame")}>SNAKE GAME</h2>
      </div>
      {
        roomId && (
          <div className='roomDetail' >
            <h3>Room Created: {roomId}</h3>
            <button onClick={joinRoom}>Join Room</button>
          </div>
        )
      }

      <div className='joinRoom' >
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  )
}


