import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import rockImg from "../assets/rock.png"
import paperImg from "../assets/paper.png"
import scissorImg from "../assets/scissor.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { makeRpsMove, reserRpsGame } from '../Redux/slice'
import { socket } from './Socket'
import axios from 'axios'
import { API } from '../global'

export function RocketPaper() {
  const user = JSON.parse(sessionStorage.getItem("user"))
  const token = JSON.parse(sessionStorage.getItem("token") || null)
  const { roomId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { rpsWinner, players } = useSelector((state) => state.game);
  const playersRef = useRef(null);
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
        }, 1000);
      }
    });

    socket.on("updateMove", (moveData) => {
      dispatch(makeRpsMove(moveData));
    });
    socket.on("resetGame", () => {
      dispatch(reserRpsGame())
    })

    return () => {
      socket.off("updateMove");
      socket.off("resetGame");
      socket.off("gameOver");
    };
  }, [dispatch])


  const handleMove = (move) => {
    dispatch(makeRpsMove({ player: user?.name, move }))
    socket.emit("rpsMove", { roomId, player: user?.name, move })
  }

  useEffect(() => {
    if (!rpsWinner || !players) return;
    if (rpsWinner === "Draw") {
      alert("Match Draw")
      socket.emit("resetTicGame", { roomId })
      return;
    }
    if (rpsWinner && playersdata) {
      const winnerID = rpsWinner === playersdata[0]?.name ? playersdata[0]?._id : playersdata[1]?._id
      socket.emit("declareWinner", { roomId, winnerID });
    }
  })

  return (
    <div className='rps' >
      <div className="rpsGameCard">
        <h1 className='RpsPlayerName'>{user?.name}</h1>
        <h1 className='RpsRoomId' >ROOM ID: <span>{roomId}</span></h1>
        <div className="rpsImages">
          <img src={rockImg} alt="ROCK" onClick={() => handleMove("rock")} />
          <img src={paperImg} alt="PAPER" onClick={() => handleMove("paper")} />
          <img src={scissorImg} alt="SCISSOR" onClick={() => handleMove("scissor")} />
        </div>
        {rpsWinner && <h2 className='rpsWinner' >Winner: <b>{rpsWinner}</b></h2>}
      </div>
      <div className="backRpsBtn">
        {
          rpsWinner && <button onClick={() => navigate("/gamelobby")} ><b>Back</b></button>
        }
      </div>
    </div>
  )
}

