import React, { useState, useEffect } from "react";
import { ReactComponent as IconX } from "./iconX.svg";
import { ReactComponent as IconO } from "./iconO.svg";

import "./styles.css";

const checkHorizontal = (playerToCheck, currentPosition, gameArray) => {
  const firstPosition = parseInt(currentPosition.charAt(0));
  let flag = true;
  for (let i = 0; i < 3; i++) {
    if (flag && gameArray[firstPosition][i] !== playerToCheck) {
      flag = false;
    }
  }
  return flag;
};

const checkVertical = (playerToCheck, currentPosition, gameArray) => {
  const secondPosition = parseInt(currentPosition.charAt(1));
  let flag = true;
  for (let i = 0; i < 3; i++) {
    if (flag && gameArray[i][secondPosition] !== playerToCheck) {
      flag = false;
    }
  }
  return flag;
};

const checkDiagonal = (playerToCheck, currentPosition, gameArray) => {
  const firstPosition = parseInt(currentPosition.charAt(0));
  const secondPosition = parseInt(currentPosition.charAt(1));
  if (firstPosition === secondPosition) {
    let flag = true;
    let i = 0,
      j = 0;
    while (flag && i < 3 && j < 3) {
      if (gameArray[i][j] !== playerToCheck) {
        flag = false;
      } else {
        i++;
        j++;
      }
    }
    return flag;
  } else {
    let flag = true;
    let i = 0,
      j = 2;
    while (flag && i < 3 && j >= 0) {
      if (gameArray[i][j] !== playerToCheck) {
        flag = false;
      } else {
        i++;
        j--;
      }
    }
    return flag;
  }
};

const initialize2DArray = () => {
  let mainArray = [];
  for (let j = 0; j < 3; j++) {
    const array = [];
    for (let i = 0; i < 3; i++) {
      let temp = "";
      array.push(temp);
    }
    mainArray.push(array);
  }
  return mainArray;
};

const checkIfTie = (gameArray) => {
  let flag = true;
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      if (flag && gameArray[i][j] === "") {
        flag = false;
      }
    }
  }
  return flag;
};

const AddValueToLocalstorage = (player1, player2, tie) => {
  // this works in local environment, not working on codesandbox.
  // window.localStorage.setItem("player1", player1);
  // window.localStorage.setItem("player2", player2);
  // window.localStorage.setItem("tie", tie);
};

const Board = () => {
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [player1, setPlayer1] = useState(0);
  const [player2, setPlayer2] = useState(0);
  const [tie, setTie] = useState(0);
  const [gameArray, setGameArray] = useState(null);
  const [lastIndex, setLastIndex] = useState("");

  useEffect(() => {
    const array = initialize2DArray();
    setGameArray(array);
    // this works in local environment, not working on codesandbox.
    // setPlayer1(
    //   window.localStorage.getItem("player1")
    //     ? parseInt(window.localStorage.getItem("player1"))
    //     : 0
    // );
    // setPlayer2(
    //   window.localStorage.getItem("player2")
    //     ? parseInt(window.localStorage.getItem("player2"))
    //     : 0
    // );
    // setTie(
    //   window.localStorage.getItem("tie")
    //     ? parseInt(window.localStorage.getItem("tie"))
    //     : 0
    // );
  }, []);

  const getNextPlayer = () => {
    if (currentPlayer === "X") {
      setCurrentPlayer("O");
    } else {
      setCurrentPlayer("X");
    }
  };

  const handlePlayerMove = (currentPlayer, index) => {
    const firstPosition = parseInt(index.charAt(0));
    const secondPosition = parseInt(index.charAt(1));

    if (gameArray[firstPosition][secondPosition] === "") {
      let NewArray = gameArray.map((array) => array.slice());
      NewArray[firstPosition][secondPosition] = currentPlayer;
      getNextPlayer();
      setGameArray(NewArray);
      setLastIndex(index);
    } else {
      alert("You cannot perform this move");
    }
  };

  const handleReset = () => {
    let NewArray = initialize2DArray();
    setGameArray(NewArray);
  };

  useEffect(() => {
    const playerToCheck = currentPlayer === "X" ? "O" : "X";

    if (lastIndex !== "") {
      if (
        checkHorizontal(playerToCheck, lastIndex, gameArray) ||
        checkVertical(playerToCheck, lastIndex, gameArray) ||
        checkDiagonal(playerToCheck, lastIndex, gameArray)
      ) {
        if (playerToCheck === "X") {
          setPlayer1((player1) => player1 + 1);
          AddValueToLocalstorage(player1 + 1, player2, tie);
          handleReset();
        } else {
          setPlayer2((player2) => player2 + 1);
          AddValueToLocalstorage(player1, player2 + 1, tie);
          handleReset();
        }
      } else {
        if (checkIfTie(gameArray)) {
          setTie((tie) => tie + 1);
          AddValueToLocalstorage(player1, player2, tie + 1);
          handleReset();
        }
      }
    }
  }, [lastIndex]);

  console.log("rerendered");
  return (
    <div className="gameBoard">
      <div className="gameTitle">Tic Tac Toe</div>
      <div className="gameCard">
        {gameArray?.map((array, index) => (
          <div key={index} id={index} className="gameRow">
            {array?.map((element, index2) => (
              <div
                className="gameBox"
                key={`${index}${index2}`}
                id={`${index}${index2}`}
                onClick={() =>
                  handlePlayerMove(currentPlayer, `${index}${index2}`)
                }
              >
                {element !== "" ? (
                  element === "X" ? (
                    <IconX />
                  ) : (
                    <IconO />
                  )
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="ScoreCard">
        <div className="scoreTab">Player 1 (X) : {player1} </div>
        <div className="scoreTab">Tie : {tie} </div>
        <div className="scoreTab">Player 2 (O) : {player2} </div>
      </div>
    </div>
  );
};

export default Board;
