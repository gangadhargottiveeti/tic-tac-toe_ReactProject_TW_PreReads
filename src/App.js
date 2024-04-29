import './styles.css'
import { useState } from "react";

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0

  //The handlePlay function needs to update Game’s state to trigger a re-render
  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  // converting history of moves into React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves
  const moves = history.map((squares, move) => {
    let description;
    if(move === history.length -1){
      description = "You are at move #"+move;

      return <li>{description}</li>
    }
    else if(move > 0){
      description = "Go to move #" + move;
    }else{
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return(
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  )
}


function Board({xIsNext, squares, onPlay}) {

  const handleClick = (i) =>{

    if(squares[i] || calculateWinner(squares)){
      return;
    }

    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = 'X';
    }else{
      nextSquares[i] = 'O';
    }
    
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const hasNoNull = squares.every(element => element !== null)
  let status;
  if (winner){
    status = "Winner : "+winner;
  }else if(hasNoNull){    // Not a winner and no null values in array means draw
    status = "Draw";
  }
  else{
    status = "Next Player : "+(xIsNext ? 'X' : 'O');
  }


  // Storing squares in an array
  const boardSquares = [];

  for(let i = 0; i < 3; i++){
    // Storing each Row squares in this array
    const squaresInRow = [];

    for(let j = 0; j < 3; j++){
      const index = i * 3 + j;
      squaresInRow.push(
        <Square 
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      )
    }

    boardSquares.push(
      <div key={i} className='board-row'>
        {squaresInRow}
      </div>
    )
  }

  return (
    <>
      <div className='status'>
        {status}
      </div>

      <div>
        {boardSquares}
      </div>
    </>
  );
}


// Square component
function Square({value, className, onSquareClick}) {

  return(
    <button className={`square ${className}`} onClick={onSquareClick}>
       {value} 
    </button>
  ); 
  
}

// function to check the winner
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6] 
  ];

  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}