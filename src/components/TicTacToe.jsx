import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { makeMoveTic, resetTicGame } from '../Redux/slice'
import { socket } from './Socket'
import axios from 'axios'
import { API } from '../global'

export function TicTacToe() {
  const { roomId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { board, currentPlayer, ticWinner } = useSelector((state) => state.game)
  const user = JSON.parse(sessionStorage.getItem("user"))
  const token = JSON.parse(sessionStorage.getItem("token") || null)
  const playersRef = useRef(null);
  const [playerSymbol, setPlayerSymbol] = useState(null)
  const [playersdata, setPlayersdata] = useState(null)

  useEffect(() => {
    const getRoomData = async () => {
      if (!user || !token) return;
      try {
        const response = await axios.get(`${API}/game/roomDetail/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setPlayersdata(response.data.players)
        playersRef.current = response.data.players
        const symbolAssign = response.data.players[0]?._id === user?._id ? "X" : "O"
        setPlayerSymbol(symbolAssign)
      } catch (error) {
        console.error("Error in fetching Room Data", error)
      }
    }
    getRoomData()

    socket.on("gameOver", ({ winner }) => {
      if (playersRef.current) {
        if (winner) {
          const winnerName = playersRef.current.find((player) => player._id === winner)?.name || "UnKnown";
          alert(`Game Over! Winner: ${winnerName}`);
        }
        setTimeout(() => {
          socket.emit("resetTicGame", { roomId });
        }, 2000);
      }
    });

    socket.on("resetGame", () => {
      dispatch(resetTicGame())
    })
    socket.on("updateGame", ({ index }) => {
      dispatch(makeMoveTic({ index }));
    });

    return () => {
      socket.off("updateGame");
      socket.off("gameOver")
      socket.off("resetGame")
    };

  }, [roomId, dispatch])

  const handleMove = (index) => {
    if (!board[index] && !ticWinner && playerSymbol === currentPlayer) {
      dispatch(makeMoveTic({ index }));
      socket.emit("tictactoeMove", { roomId, index });
    }
    else {
      alert("Not your turn!")
    }
  }
  useEffect(() => {
    if (ticWinner === "Draw") {
      setTimeout(() => {
        alert("Match Draw!");
      }, 1000);
      setTimeout(() => {
        socket.emit("resetTicGame", { roomId });
      }, 2000);
      return;
    }

    if (ticWinner && playersdata) {
      let winnerID = ticWinner === "X" ? playersdata[0]?._id : playersdata[1]?._id;
      socket.emit("declareWinner", { roomId, winnerID });
    }
  }, [ticWinner, roomId, playersdata]);

  return (
    <div className="ticTacToe">
      <div className="ticGameCard" >
        <h1 className="ticPlayerName" >{user?.name}</h1>
        <h1 className="ticRoomId" >ROOM ID: {roomId}</h1>
        <div className="gameBoard">
          {
            board.map((res, index) => (
              <button className="boardBox" key={index} onClick={() => handleMove(index)}>{res ? res : ""}</button>
            ))}
        </div>
        {ticWinner ? (
          <h1 className="winnerTic">Winner - <b>{playersdata[ticWinner === "X" ? 0 : 1]?.name || "UnKnown"}</b></h1>
        ) : (
          <h2 className="currentPlayer">Current Turn - <b>{currentPlayer}</b></h2>
        )}
      </div>
      <div className="backBtn">
        {
          ticWinner && <button onClick={() => navigate("/gamelobby")} ><b>Back</b></button>
        }
      </div>
    </div>
  )
}

