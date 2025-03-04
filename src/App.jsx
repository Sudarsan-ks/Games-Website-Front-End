import { Route, Routes } from "react-router-dom";
import { Protected } from "./components/Protected";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ResetPass } from "./components/ResetPass";
import { ForgotPass } from "./components/ForgotPass";
import { GameLobby } from "./components/GameLobby";
import { Error } from "./components/Error";
import { TicTacToe } from "./components/TicTacToe";
import { RocketPaper } from "./components/RocketPaper";
import { Snake } from "./components/Snake";
import { AdminDash } from "./components/AdminDash";
import { Unauthorized } from "./components/Unauthorized";
import { Room } from "./components/Room";


function App() {
  return (
    <div className="Online-Games">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPass" element={<ResetPass />} />
        <Route path="/forgotPass" element={<ForgotPass />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/gamelobby" element={<Protected><GameLobby /></Protected>} />
        <Route path="/TicTacToe/:roomId" element={<Protected><TicTacToe /></Protected>} />
        <Route path="/RockPaperScissors/:roomId" element={<Protected><RocketPaper /></Protected>} />
        <Route path="/SnakeGame" element={<Protected><Snake /></Protected>} />
        <Route path="/room/:roomId" element={<Protected><Room /></Protected>} />
        <Route path="/adminDash" element={<Protected adminOnly={true} ><AdminDash /></Protected>} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
