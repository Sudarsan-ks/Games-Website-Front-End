import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { playerJoined, setGameReady } from "../Redux/slice";
import { socket } from "./Socket";

export function Room() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const { players } = useSelector((state) => state.game);

  useEffect(() => {
    socket.on("playerJoined", ({ players }) => {
      console.log("Player list updated:", players);
      dispatch(playerJoined({ players }));
    });

    socket.on("gameReady", ({ roomId, gameType }) => {
      console.log("Game is starting...");
      dispatch(setGameReady(true));
      navigate(`/${gameType}/${roomId}`);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("gameReady");
    };
  }, [dispatch, navigate]);

  return (
    <div className="roomPage">
      <h2>Waiting for Players...</h2>
      <p>Room ID: <b>{roomId}</b></p>
      <h3>Players:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <p>Share this Room ID with another player to join!</p>
    </div>
  );
}
