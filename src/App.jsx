import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react'

const { Badge, Button, Card } = ReactBootstrap

export default function App() {
  const [name, setName] = React.useState('World')
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = React.useState(true);
  const [numPieces, setNumPieces] = React.useState(0);
  //const [clickCount, setClickCount] = React.useState(0);
  const [source, setSource] = React.useState(null); // holds index
  let invalid = false;
  let inCenter = false;

  function handleClick(i){
    if(calculateWinner(squares))
      return;

    console.log('source value = ' + source)

    const nextSquares = squares.slice();
    if(numPieces < 6){
      console.log('less than 6 pieces on board')
      if(squares[i])
        return;
      if(xIsNext){
        nextSquares[i] = 'X';
      }
      else{
        nextSquares[i] = 'O';
      }
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      setNumPieces(numPieces+1);
    }
    else{ // each player has three pieces
      console.log('greater than 6 pieces on board')
      if(source !== null){ // already clicked source square
        nextSquares[source] = null;
        nextSquares[i] = (xIsNext ? 'X' : 'O');

        console.log('select dest square')
        if((squares[i] || !isAdjacentSquare(source, i)) || 
            (squares[4] == (xIsNext ? 'X' : 'O') && source!=4 && calculateWinner(nextSquares) != (xIsNext ? 'X' : 'O')) ){ // if invalid after 2 clicks, reset

          console.log('dest square NOT empty or NOT adjacent, need to try again')
          // invalid = false;
          setSource(null);
          return;
        }
        
        setSource(null);
        setSquares(nextSquares);

        // if(inCenter && i!=4 && calculateWinner(nextSquares) != (xIsNext ? 'X' : 'O')){ // invalid center move
        //   // invalid = false;
        //   setSource(null);
        //   return;
        // }

        console.log('successfully moved game piece')

        // inCenter = false;
        setXIsNext(!xIsNext);
        setNumPieces(numPieces+1);
      }
      else{ // current click is soruce square
        console.log('select source square')

        // setSource(i);

        // if(squares[4] == (xIsNext ? 'X' : 'O')) { // center piece
        //   inCenter = true; // need to reset for each player
        // }
        
        if((squares[i] == (xIsNext ? 'X' : 'O') && isPossibleMove(i, squares))){ // makes sure square contains player's matching symbol
          setSource(i);
          //console.log('valid source square selected')
          // invalid = true;
        }
        else{ // if not, ignore click
          //console.log('invalid source square selected, need to try again')
          // invalid = true;
          return;
        }
      }
    }
    
    
    console.log('////==============================')
  }

  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = 'Winner: ' + winner;
  }
  else{
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className='status'> {status} </div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>

      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick} >
      {value}
    </button>);
}

function calculateWinner(squares){
  console.log('check for winner...')
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isAdjacentSquare(source, dest){
  const sRow = Math.floor(source / 3);
  const sCol = source % 3;
  const dRow = Math.floor(dest / 3);
  const dCol = dest % 3;

  if(sRow == dRow && sCol == dCol)
    return false;

  return (Math.abs(sRow-dRow) <= 1 && Math.abs(sCol-dCol) <= 1);
}

function isPossibleMove(source, squares){
  for(let i = 0; i<9; i++){
    if(isAdjacentSquare(source, i)){
      if(!squares[i]) // empty
        return true;
    }
  }
  return false;
}

/*
<div className="container py-4">
      <Card className="starter-card shadow-sm">
        <Card.Body className="p-4">
          <h1 className="greeting display-6 fw-bold">Hello, {name}!</h1>
          <p className="mb-3 text-secondary">
            This starter is set up to match the React Essentials notes more closely.
            For the assignment, build the tic-tac-toe tutorial in this file and leave
            mounting to <code>src/main.jsx</code>.
          </p>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <Button variant="primary" onClick={() => setName('CS 35L')}>
              Set example name
            </Button>
            <Badge bg="secondary" pill>
              ReactBootstrap ready
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </div>
*/