import React, { useState, useEffect } from "react";

const BOARDGRIDSIZE = 20;
const instialSnake = [{ x: BOARDGRIDSIZE / 2, y: BOARDGRIDSIZE / 2 }, { x: BOARDGRIDSIZE / 2 + 1, y: BOARDGRIDSIZE / 2 }];

export function Snake() {
  const user = JSON.parse(sessionStorage.getItem("user")) || { name: "Player" };
  const [snake, setSnake] = useState(instialSnake);
  const [food, setFood] = useState({ x: 5, y: 5 })
  const [direction, setDirection] = useState("LEFT")
  const [score, setScore] = useState(0)
  const highScore = localStorage.getItem("highScore")

  function gridBoard() {
    let cellArray = []
    for (var row = 0; row < BOARDGRIDSIZE; row++) {
      for (var col = 0; col < BOARDGRIDSIZE; col++) {
        let className = "cell"
        let isFood = food.x === row && food.y === col
        let isSnake = snake.some((sak) => sak.x === row && sak.y === col)
        let snakeHead = snake[0].x === row && snake[0].y === col
        if (isFood) {
          className = className + " food";
        }
        if (isSnake) {
          className = className + " snake";
        }
        if (snakeHead) {
          className = className + " snakeHead";
        }
        let cell = <div className={className} key={`${row}-${col}`} ></div>
        cellArray.push(cell)
      }
    }
    return cellArray
  }

  function renderFood() {
    let xPosition = Math.floor(Math.random() * BOARDGRIDSIZE)
    let yPosition = Math.floor(Math.random() * BOARDGRIDSIZE)
    setFood({ x: xPosition, y: yPosition })
  }

  function gameOver() {
    setSnake(instialSnake)
  }

  function updateGame() {

    if (snake[0].x < 0 || snake[0].x > 20 || snake[0].y < 0 || snake[0].y > 20) {
      gameOver()
      localStorage.setItem("highScore", score)
      setScore(0)
      return
    }

    let isBite = snake.slice(1).some((sak) => sak.x === snake[0].x && sak.y === snake[0].y)
    if (isBite) {
      gameOver(0)
      localStorage.setItem("highScore", score)
      setScore(0)
      return
    }

    let newSanke = [...snake]

    switch (direction) {
      case "LEFT":
        newSanke.unshift({ x: newSanke[0].x, y: newSanke[0].y - 1 })
        break
      case "RIGHT":
        newSanke.unshift({ x: newSanke[0].x, y: newSanke[0].y + 1 })
        break
      case "UP":
        newSanke.unshift({ x: newSanke[0].x - 1, y: newSanke[0].y })
        break
      case "DOWN":
        newSanke.unshift({ x: newSanke[0].x + 1, y: newSanke[0].y })
        break
    }

    let isAte = newSanke[0].x === food.x && newSanke[0].y === food.y
    if (isAte) {
      setScore((pre) => pre + 1)
      renderFood()
    }
    else {
      newSanke.pop()
    }
    setSnake(newSanke)
  }

  function updateDirection(e) {
    let code = e.code
    switch (code) {
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT")
        break
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT")
        break
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP")
        break
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN")
        break
    }
  }


  useEffect(() => {
    let interval = setInterval(updateGame, 250)
    return () => clearInterval(interval, updateGame)
  })

  useEffect(() => {
    document.addEventListener("keydown", updateDirection)
    return () => clearInterval("keydown", updateDirection)
  })
  return (
    <div className="snakeGame">
      <div className="snakeCard">
        <div className="snakePlayer">
          <h2>{user?.name}</h2>
        </div>
        <div className="snakeScore">
          <h2>Score: {score}</h2>
          <h2>High Score: {highScore}</h2>
        </div>
        <div className="snakeBoard">{gridBoard()}</div>
      </div>
    </div>
  );
}
