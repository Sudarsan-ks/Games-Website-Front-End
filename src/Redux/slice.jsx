import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    games: [],
    user: [],
    roomId: null,
    gameType: null,
    players: [],
    isGameReady: false,
    board: Array(9).fill(null),
    currentPlayer: "X",
    ticWinner: null,
    moves: {},
    rpsWinner: null
}

const checkWinnerOFTic = (board) => {
    const winningChance = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let chance of winningChance) {
        const [a, b, c] = chance
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]
        }
    }
    return null;
}

const checkRpsWinner = (players) => {
    const playerNames = Object.keys(players);

    if (playerNames.length < 2) return null;

    const [player1, player2] = playerNames;
    const move1 = players[player1];
    const move2 = players[player2];

    if (move1 === move2) return "Draw";

    if (
        (move1 === "rock" && move2 === "scissors") ||
        (move1 === "scissors" && move2 === "paper") ||
        (move1 === "paper" && move2 === "rock")
    ) {
        return player1;
    } else {
        return player2;
    }
}

export const gameSlice = createSlice({
    name: "onlineGames",
    initialState,
    reducers: {
        userdata: (state, action) => {
            state.user = action.payload
        },
        editdata: (state, action) => {
            state.user = state.user.map((data) =>
                data._id === action.payload._id ? action.payload : data
            );
        },
        setRoomData: (state, action) => {
            state.roomId = action.payload.roomId;
            state.gameType = action.payload.gameType;
            state.players = action.payload.players;
        },
        playerJoined: (state, action) => {
            state.players = action.payload.players;
        },
        setGameReady: (state, action) => {
            state.isGameReady = action.payload;
        },
        makeMoveTic: (state, action) => {
            const { index } = action.payload;
            if (!state.board[index]) {
                state.board[index] = state.currentPlayer;
                const winner = checkWinnerOFTic(state.board)
                if (winner) {
                    state.ticWinner = winner;
                } else if (!state.board.includes(null)) {
                    state.ticWinner = "Draw";
                } else {
                    state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
                }
            }
        },
        resetTicGame: (state, action) => {
            state.board = Array(9).fill(null)
            state.ticWinner = null
            state.currentPlayer = "X"
            state.players = []
        },
        makeRpsMove: (state, action) => {
            const { player, move } = action.payload
            state.moves[player] = move
            if (Object.keys(state.moves).length === 2) {
                const winner = checkRpsWinner(state.moves)
                state.rpsWinner = winner
            }
        },
        reserRpsGame: (state, action) => {
            state.moves = {}
            state.rpsWinner = null
        }
    }
})
export const { userdata, editdata, setRoomData, playerJoined, makeMoveTic, setGameReady, resetTicGame, makeRpsMove, reserRpsGame } = gameSlice.actions
export default gameSlice.reducer